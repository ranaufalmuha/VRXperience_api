const { IDL } = require('@dfinity/candid');
const idlFactory = ({ IDL }) => {

    return IDL.Service({
        'icrc1_name': IDL.Func([], [IDL.Text], []),
        'total_supply': IDL.Func([], [IDL.Nat], []),
        'balance_of': IDL.Func([IDL.Text], [IDL.Nat], []),
        'claim_token': IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
    });
};

module.exports = { idlFactory };
