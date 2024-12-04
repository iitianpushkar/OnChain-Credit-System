use anchor_lang::prelude::*;
use std::str::FromStr;

declare_id!("Hne55wytgfHCuSx2DVv4EFMwGwT7gnwX31Y4zWb11qB9");


#[program]
pub mod transfer_sol {
    use anchor_lang::solana_program::{program::invoke_signed,system_instruction};

    use super::*;

    const AUTHORIZED_PUBLIC_KEY: &str = "89v7pPTSVsVScNnLjGPNsKPewz5kANRPgaLnHCds4Dph";


    pub fn initialize(ctx:Context<Initialize>) -> Result<()>{

        let authorized_key = Pubkey::from_str(AUTHORIZED_PUBLIC_KEY).expect("Invalid public key");
        require_keys_eq!(
            ctx.accounts.sender.key(),
            authorized_key,
            LiquidityPoolError::Unauthorized 
        );
        Ok(())
    }
    
    pub fn initialize_transfer(ctx: Context<InitializeTransfer>) -> Result<()> {

        let pda_address1=ctx.accounts.pda_account1.key();
        let pda_address2=ctx.accounts.pda_account2.key();
        let sender=ctx.accounts.sender.key();
        let receiver=ctx.accounts.receiver.key();
        let bump=ctx.bumps.pda_account1;

        let instruction=&system_instruction::transfer(
            &pda_address1,
        &pda_address2,1_000_000_000);

        let account_infos=[
            ctx.accounts.pda_account1.to_account_info(),
            ctx.accounts.pda_account2.to_account_info(),
             ctx.accounts.sender.to_account_info(),
            ctx.accounts.system_program.to_account_info()
        ];


        invoke_signed(instruction, &account_infos, &[&[b"ackee",sender.as_ref(), &[bump]]] )?;


        Ok(())
    }
}

#[error_code]
pub enum LiquidityPoolError {
    #[msg("Unauthorized access. Only the authorized public key can initialize the liquidity pool.")]
    Unauthorized,
}

#[derive(Accounts)]

pub struct Initialize<'info>{
    /// CHECK: ackee
    #[account(
        mut,
        seeds= [b"ackee", sender.key().as_ref()],
        bump,
    )]
    pub pda_account1: AccountInfo<'info>,

    pub sender: Signer<'info>,
}
#[derive(Accounts)]

pub struct InitializeTransfer<'info>{
    /// CHECK: ackee
    #[account(
        mut,
        seeds= [b"ackee", sender.key().as_ref()],
        bump,
    )]
    pub pda_account1: AccountInfo<'info>,
    /// CHECK: ackee
    #[account(
        mut,
    seeds= [b"ackee", receiver.key().as_ref()],
    bump,
)]
    pub pda_account2: AccountInfo<'info>,

    pub sender: AccountInfo<'info>,
    pub receiver: Signer<'info>,
    pub system_program:Program<'info,System>,
}
