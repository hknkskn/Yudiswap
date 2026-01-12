/// YudiSwap Liquidity Pool Module
/// Manages liquidity pools with reserves and fee collection
module yudiswap::liquidity_pool {
    use std::signer;
    use supra_framework::coin::{Self, Coin};
    use supra_framework::event;
    use yudiswap::lp_token;
    use std::string;
    
    /// Errors
    const E_POOL_EXISTS: u64 = 1;
    const E_POOL_NOT_EXISTS: u64 = 2;
    const E_INSUFFICIENT_LIQUIDITY: u64 = 3;
    const E_INSUFFICIENT_AMOUNT: u64 = 4;
    const E_ZERO_AMOUNT: u64 = 5;
    const E_IDENTICAL_TOKENS: u64 = 6;
    const E_SLIPPAGE_EXCEEDED: u64 = 7;
    const E_K_INVARIANT: u64 = 8;
    
    /// Fee: 0.3% = 3/1000
    const FEE_NUMERATOR: u64 = 3;
    const FEE_DENOMINATOR: u64 = 1000;
    
    /// Minimum liquidity to prevent manipulation
    const MINIMUM_LIQUIDITY: u64 = 1000;
    
    /// Pool resource
    struct Pool<phantom CoinA, phantom CoinB> has key {
        reserve_a: Coin<CoinA>,
        reserve_b: Coin<CoinB>,
        fee_a: Coin<CoinA>,
        fee_b: Coin<CoinB>,
    }
    
    /// Pool configuration
    struct PoolConfig has key {
        fee_numerator: u64,
        fee_denominator: u64,
        is_paused: bool,
    }
    
    /// Events
    #[event]
    struct PoolCreatedEvent has drop, store {
        creator: address,
        coin_a_type: vector<u8>,
        coin_b_type: vector<u8>,
    }
    
    #[event]
    struct LiquidityAddedEvent has drop, store {
        provider: address,
        amount_a: u64,
        amount_b: u64,
        lp_minted: u64,
    }
    
    #[event]
    struct LiquidityRemovedEvent has drop, store {
        provider: address,
        amount_a: u64,
        amount_b: u64,
        lp_burned: u64,
    }
    
    #[event]
    struct SwapEvent has drop, store {
        sender: address,
        amount_in: u64,
        amount_out: u64,
        coin_in_type: vector<u8>,
        coin_out_type: vector<u8>,
    }
    
    /// Create a new liquidity pool
    public entry fun create_pool<CoinA, CoinB>(
        creator: &signer,
        initial_a: u64,
        initial_b: u64,
    ) {
        let creator_addr = signer::address_of(creator);
        
        // Ensure pool doesn't exist
        assert!(!exists<Pool<CoinA, CoinB>>(creator_addr), E_POOL_EXISTS);
        assert!(initial_a > 0 && initial_b > 0, E_ZERO_AMOUNT);
        
        // Withdraw coins from creator
        let coin_a = coin::withdraw<CoinA>(creator, initial_a);
        let coin_b = coin::withdraw<CoinB>(creator, initial_b);
        
        // Create pool
        move_to(creator, Pool<CoinA, CoinB> {
            reserve_a: coin_a,
            reserve_b: coin_b,
            fee_a: coin::zero<CoinA>(),
            fee_b: coin::zero<CoinB>(),
        });
        
        // Initialize pool config
        move_to(creator, PoolConfig {
            fee_numerator: FEE_NUMERATOR,
            fee_denominator: FEE_DENOMINATOR,
            is_paused: false,
        });
        
        // Initialize LP token
        lp_token::initialize<CoinA, CoinB>(
            creator,
            string::utf8(b"YudiSwap LP Token"),
            string::utf8(b"YUDI-LP"),
        );
        
        // Calculate initial LP tokens using sqrt(a * b)
        let initial_lp = sqrt((initial_a as u128) * (initial_b as u128));
        
        // Mint LP tokens (minus minimum liquidity locked)
        let lp_to_mint = initial_lp - (MINIMUM_LIQUIDITY as u64);
        lp_token::mint<CoinA, CoinB>(creator_addr, creator_addr, lp_to_mint);
        
        event::emit(PoolCreatedEvent {
            creator: creator_addr,
            coin_a_type: b"CoinA",
            coin_b_type: b"CoinB",
        });
    }
    
    /// Get pool reserves
    public fun get_reserves<CoinA, CoinB>(pool_addr: address): (u64, u64) acquires Pool {
        let pool = borrow_global<Pool<CoinA, CoinB>>(pool_addr);
        (
            coin::value(&pool.reserve_a),
            coin::value(&pool.reserve_b)
        )
    }
    
    /// Check if pool exists
    public fun pool_exists<CoinA, CoinB>(pool_addr: address): bool {
        exists<Pool<CoinA, CoinB>>(pool_addr)
    }
    
    /// Calculate output amount for swap
    public fun get_amount_out(
        amount_in: u64,
        reserve_in: u64,
        reserve_out: u64,
    ): u64 {
        assert!(amount_in > 0, E_ZERO_AMOUNT);
        assert!(reserve_in > 0 && reserve_out > 0, E_INSUFFICIENT_LIQUIDITY);
        
        // Apply fee: amount_in * (1 - fee) = amount_in * 997 / 1000
        let amount_in_with_fee = (amount_in as u128) * ((FEE_DENOMINATOR - FEE_NUMERATOR) as u128);
        let numerator = amount_in_with_fee * (reserve_out as u128);
        let denominator = (reserve_in as u128) * (FEE_DENOMINATOR as u128) + amount_in_with_fee;
        
        ((numerator / denominator) as u64)
    }
    
    /// Calculate required input for desired output
    public fun get_amount_in(
        amount_out: u64,
        reserve_in: u64,
        reserve_out: u64,
    ): u64 {
        assert!(amount_out > 0, E_ZERO_AMOUNT);
        assert!(reserve_in > 0 && reserve_out > 0, E_INSUFFICIENT_LIQUIDITY);
        assert!(amount_out < reserve_out, E_INSUFFICIENT_LIQUIDITY);
        
        let numerator = (reserve_in as u128) * (amount_out as u128) * (FEE_DENOMINATOR as u128);
        let denominator = ((reserve_out - amount_out) as u128) * ((FEE_DENOMINATOR - FEE_NUMERATOR) as u128);
        
        (((numerator / denominator) + 1) as u64)
    }
    
    /// Quote optimal liquidity amounts
    public fun quote(amount_a: u64, reserve_a: u64, reserve_b: u64): u64 {
        assert!(amount_a > 0, E_ZERO_AMOUNT);
        assert!(reserve_a > 0 && reserve_b > 0, E_INSUFFICIENT_LIQUIDITY);
        
        ((amount_a as u128) * (reserve_b as u128) / (reserve_a as u128) as u64)
    }
    
    /// Babylonian method for square root
    fun sqrt(x: u128): u64 {
        if (x == 0) return 0;
        
        let z = (x + 1) / 2;
        let y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        };
        (y as u64)
    }
    
    /// Min function
    fun min(a: u64, b: u64): u64 {
        if (a < b) { a } else { b }
    }
}
