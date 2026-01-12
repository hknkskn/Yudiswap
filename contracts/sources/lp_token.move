/// YudiSwap LP Token Module
/// Manages LP token minting, burning, and transfers
module yudiswap::lp_token {
    use std::signer;
    use std::string::{Self, String};
    use supra_framework::event;
    
    /// Errors
    const E_NOT_AUTHORIZED: u64 = 1;
    const E_INSUFFICIENT_BALANCE: u64 = 2;
    const E_ZERO_AMOUNT: u64 = 3;
    
    /// LP Token structure
    struct LPToken<phantom CoinA, phantom CoinB> has key, store {
        value: u64,
    }
    
    /// LP Token info (stored at pool address)
    struct LPTokenInfo<phantom CoinA, phantom CoinB> has key {
        total_supply: u64,
        name: String,
        symbol: String,
        decimals: u8,
    }
    
    /// User LP balance
    struct LPBalance<phantom CoinA, phantom CoinB> has key {
        amount: u64,
    }
    
    /// Events
    #[event]
    struct MintEvent has drop, store {
        to: address,
        amount: u64,
    }
    
    #[event]
    struct BurnEvent has drop, store {
        from: address,
        amount: u64,
    }
    
    #[event]
    struct TransferEvent has drop, store {
        from: address,
        to: address,
        amount: u64,
    }
    
    /// Initialize LP token for a pool
    public fun initialize<CoinA, CoinB>(
        pool_signer: &signer,
        name: String,
        symbol: String,
    ) {
        let pool_addr = signer::address_of(pool_signer);
        
        move_to(pool_signer, LPTokenInfo<CoinA, CoinB> {
            total_supply: 0,
            name,
            symbol,
            decimals: 8,
        });
    }
    
    /// Mint LP tokens to user
    public fun mint<CoinA, CoinB>(
        pool_addr: address,
        to: address,
        amount: u64,
    ) acquires LPTokenInfo, LPBalance {
        assert!(amount > 0, E_ZERO_AMOUNT);
        
        // Update total supply
        let info = borrow_global_mut<LPTokenInfo<CoinA, CoinB>>(pool_addr);
        info.total_supply = info.total_supply + amount;
        
        // Update user balance
        if (exists<LPBalance<CoinA, CoinB>>(to)) {
            let balance = borrow_global_mut<LPBalance<CoinA, CoinB>>(to);
            balance.amount = balance.amount + amount;
        };
        // Note: In production, would need to create balance if not exists
        
        event::emit(MintEvent { to, amount });
    }
    
    /// Burn LP tokens from user
    public fun burn<CoinA, CoinB>(
        pool_addr: address,
        from: address,
        amount: u64,
    ) acquires LPTokenInfo, LPBalance {
        assert!(amount > 0, E_ZERO_AMOUNT);
        
        // Check and update user balance
        let balance = borrow_global_mut<LPBalance<CoinA, CoinB>>(from);
        assert!(balance.amount >= amount, E_INSUFFICIENT_BALANCE);
        balance.amount = balance.amount - amount;
        
        // Update total supply
        let info = borrow_global_mut<LPTokenInfo<CoinA, CoinB>>(pool_addr);
        info.total_supply = info.total_supply - amount;
        
        event::emit(BurnEvent { from, amount });
    }
    
    /// Get LP token balance
    public fun balance_of<CoinA, CoinB>(owner: address): u64 acquires LPBalance {
        if (exists<LPBalance<CoinA, CoinB>>(owner)) {
            borrow_global<LPBalance<CoinA, CoinB>>(owner).amount
        } else {
            0
        }
    }
    
    /// Get total supply
    public fun total_supply<CoinA, CoinB>(pool_addr: address): u64 acquires LPTokenInfo {
        borrow_global<LPTokenInfo<CoinA, CoinB>>(pool_addr).total_supply
    }
    
    /// Get LP token info
    public fun get_info<CoinA, CoinB>(pool_addr: address): (String, String, u8, u64) acquires LPTokenInfo {
        let info = borrow_global<LPTokenInfo<CoinA, CoinB>>(pool_addr);
        (info.name, info.symbol, info.decimals, info.total_supply)
    }
}
