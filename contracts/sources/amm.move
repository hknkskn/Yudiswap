/// YudiSwap AMM Module
/// Implements constant product AMM (x * y = k) for token swaps
module yudiswap::amm {
    use std::signer;
    use supra_framework::coin::{Self, Coin};
    use supra_framework::event;
    
    /// Error codes
    const E_INSUFFICIENT_LIQUIDITY: u64 = 1;
    const E_SLIPPAGE_EXCEEDED: u64 = 2;
    const E_ZERO_AMOUNT: u64 = 3;
    const E_IDENTICAL_TOKENS: u64 = 4;
    const E_POOL_EXISTS: u64 = 5;
    const E_POOL_NOT_EXISTS: u64 = 6;
    
    /// Fee constants (0.3% = 30 basis points)
    const FEE_NUMERATOR: u64 = 3;
    const FEE_DENOMINATOR: u64 = 1000;
    
    /// Minimum liquidity locked forever
    const MINIMUM_LIQUIDITY: u64 = 1000;

    /// LP Token for liquidity providers
    struct LPToken<phantom CoinA, phantom CoinB> has key, store {}

    /// Liquidity Pool resource
    struct LiquidityPool<phantom CoinA, phantom CoinB> has key {
        reserve_a: Coin<CoinA>,
        reserve_b: Coin<CoinB>,
        lp_supply: u64,
    }

    /// Events
    #[event]
    struct SwapEvent has drop, store {
        sender: address,
        amount_in: u64,
        amount_out: u64,
        is_a_to_b: bool,
    }

    #[event]
    struct AddLiquidityEvent has drop, store {
        sender: address,
        amount_a: u64,
        amount_b: u64,
        lp_minted: u64,
    }

    #[event]
    struct RemoveLiquidityEvent has drop, store {
        sender: address,
        amount_a: u64,
        amount_b: u64,
        lp_burned: u64,
    }

    /// Calculate output amount using constant product formula
    /// amount_out = (amount_in * fee_adjusted * reserve_out) / (reserve_in + amount_in * fee_adjusted)
    public fun get_amount_out(
        amount_in: u64,
        reserve_in: u64,
        reserve_out: u64
    ): u64 {
        assert!(amount_in > 0, E_ZERO_AMOUNT);
        assert!(reserve_in > 0 && reserve_out > 0, E_INSUFFICIENT_LIQUIDITY);

        let amount_in_with_fee = (amount_in as u128) * ((FEE_DENOMINATOR - FEE_NUMERATOR) as u128);
        let numerator = amount_in_with_fee * (reserve_out as u128);
        let denominator = (reserve_in as u128) * (FEE_DENOMINATOR as u128) + amount_in_with_fee;
        
        ((numerator / denominator) as u64)
    }

    /// Calculate required input for desired output
    public fun get_amount_in(
        amount_out: u64,
        reserve_in: u64,
        reserve_out: u64
    ): u64 {
        assert!(amount_out > 0, E_ZERO_AMOUNT);
        assert!(reserve_in > 0 && reserve_out > 0, E_INSUFFICIENT_LIQUIDITY);
        assert!(amount_out < reserve_out, E_INSUFFICIENT_LIQUIDITY);

        let numerator = (reserve_in as u128) * (amount_out as u128) * (FEE_DENOMINATOR as u128);
        let denominator = ((reserve_out - amount_out) as u128) * ((FEE_DENOMINATOR - FEE_NUMERATOR) as u128);
        
        (((numerator / denominator) + 1) as u64)
    }

    /// Quote liquidity for adding to pool
    public fun quote(
        amount_a: u64,
        reserve_a: u64,
        reserve_b: u64
    ): u64 {
        assert!(amount_a > 0, E_ZERO_AMOUNT);
        assert!(reserve_a > 0 && reserve_b > 0, E_INSUFFICIENT_LIQUIDITY);
        
        ((amount_a as u128) * (reserve_b as u128) / (reserve_a as u128) as u64)
    }

    /// Check if pool exists
    public fun pool_exists<CoinA, CoinB>(pool_address: address): bool {
        exists<LiquidityPool<CoinA, CoinB>>(pool_address)
    }

    /// Get pool reserves
    public fun get_reserves<CoinA, CoinB>(
        pool_address: address
    ): (u64, u64) acquires LiquidityPool {
        let pool = borrow_global<LiquidityPool<CoinA, CoinB>>(pool_address);
        (
            coin::value(&pool.reserve_a),
            coin::value(&pool.reserve_b)
        )
    }

    /// Calculate sqrt for initial liquidity
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
}
