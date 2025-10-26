/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 */
export type Kaiwu = {
  address: "62XmxPoMk15LdgH8a8UWgyj9wLTXfjcswL3UDBVSS8NG"
  metadata: {
    name: "kaiwu"
    version: "0.1.0"
    spec: "0.1.0"
    description: "Created with Anchor"
  }
  instructions: [
    {
      name: "buyItem"
      discriminator: [80, 82, 193, 201, 216, 27, 70, 184]
      accounts: [
        { name: "config"; pda: { seeds: [{ kind: "const"; value: [99, 111, 110, 102, 105, 103] }] } },
        { name: "item"; writable: true },
        { name: "receipt"; writable: true },
        { name: "listing"; writable: true },
        { name: "buyer"; writable: true; signer: true },
        { name: "seller"; writable: true; relations: ["listing"] },
        { name: "treasury"; writable: true },
        { name: "systemProgram"; address: "11111111111111111111111111111111" },
      ]
      args: []
    },
    {
      name: "delistItem"
      discriminator: [243, 224, 175, 39, 170, 10, 179, 114]
      accounts: [
        { name: "item"; writable: true },
        { name: "receipt"; writable: true },
        { name: "listing"; writable: true },
        { name: "currentOwner"; writable: true; signer: true; relations: ["item"] },
        { name: "owner"; relations: ["receipt"] },
        { name: "seller"; relations: ["listing"] },
      ]
      args: []
    },
    {
      name: "initConfig"
      discriminator: [23, 235, 115, 232, 168, 96, 1, 231]
      accounts: [
        { name: "config"; pda: { seeds: [{ kind: "const"; value: [99, 111, 110, 102, 105, 103] }] } },
        { name: "governance"; writable: true; signer: true },
        { name: "systemProgram"; address: "11111111111111111111111111111111" },
      ]
      args: [
        { name: "feeBps"; type: "u16" },
        { name: "treasury"; type: "pubkey" },
        { name: "governance"; type: "pubkey" },
      ]
    },
    {
      name: "intakeItem"
      discriminator: [164, 181, 197, 11, 108, 13, 104, 145]
      accounts: [
        { name: "config"; pda: { seeds: [{ kind: "const"; value: [99, 111, 110, 102, 105, 103] }] } },
        {
          name: "item"
          writable: true
          pda: { seeds: [{ kind: "const"; value: [105, 116, 101, 109] }, { kind: "arg"; path: "itemId" }] }
        },
        {
          name: "receipt"
          writable: true
          pda: {
            seeds: [{ kind: "const"; value: [114, 101, 99, 101, 105, 112, 116] }, { kind: "account"; path: "item" }]
          }
        },
        { name: "initialOwner" },
        { name: "operator"; writable: true; signer: true },
        { name: "systemProgram"; address: "11111111111111111111111111111111" },
      ]
      args: [
        { name: "itemId"; type: "u64" },
        { name: "skuHash"; type: { array: ["u8", 32] } },
        { name: "vaultHash"; type: { array: ["u8", 32] } },
      ]
    },
    {
      name: "listItem"
      discriminator: [174, 245, 22, 211, 228, 103, 121, 13]
      accounts: [
        { name: "item"; writable: true },
        { name: "receipt"; writable: true },
        {
          name: "listing"
          writable: true
          pda: {
            seeds: [{ kind: "const"; value: [108, 105, 115, 116, 105, 110, 103] }, { kind: "account"; path: "item" }]
          }
        },
        { name: "currentOwner"; writable: true; signer: true; relations: ["item"] },
        { name: "owner"; relations: ["receipt"] },
        { name: "systemProgram"; address: "11111111111111111111111111111111" },
      ]
      args: [{ name: "priceLamports"; type: "u64" }, { name: "expiresAt"; type: "i64" }]
    },
    {
      name: "redeemConfirm"
      discriminator: [144, 38, 239, 89, 61, 150, 116, 161]
      accounts: [
        { name: "config"; pda: { seeds: [{ kind: "const"; value: [99, 111, 110, 102, 105, 103] }] } },
        { name: "item"; writable: true },
        { name: "receipt"; writable: true },
        { name: "operator"; writable: true; signer: true },
      ]
      args: [{ name: "warehouseRef"; type: "string" }]
    },
    {
      name: "redeemRequest"
      discriminator: [237, 30, 113, 222, 127, 230, 203, 243]
      accounts: [
        { name: "item"; writable: true },
        { name: "receipt"; writable: true },
        { name: "currentOwner"; writable: true; signer: true; relations: ["item"] },
        { name: "owner"; relations: ["receipt"] },
      ]
      args: []
    },
  ]
  accounts: [
    { name: "config"; discriminator: [155, 12, 170, 224, 30, 250, 204, 130] },
    { name: "item"; discriminator: [92, 157, 163, 130, 72, 254, 86, 216] },
    { name: "listing"; discriminator: [218, 32, 50, 73, 43, 134, 26, 58] },
    { name: "receipt"; discriminator: [39, 154, 73, 106, 80, 102, 145, 153] },
  ]
  events: [
    { name: "configUpdated"; discriminator: [40, 241, 230, 122, 11, 19, 198, 194] },
    { name: "delisted"; discriminator: [127, 52, 154, 240, 230, 144, 87, 87] },
    { name: "itemIntaked"; discriminator: [89, 1, 28, 250, 123, 189, 11, 60] },
    { name: "listed"; discriminator: [243, 173, 136, 195, 125, 241, 12, 99] },
    { name: "receiptMinted"; discriminator: [100, 166, 3, 33, 2, 189, 140, 144] },
    { name: "redeemConfirmed"; discriminator: [48, 53, 239, 254, 112, 179, 33, 99] },
    { name: "redeemRequested"; discriminator: [5, 130, 67, 249, 243, 168, 11, 88] },
    { name: "tradeSettled"; discriminator: [22, 119, 166, 225, 175, 53, 93, 216] },
  ]
  errors: [
    { code: 6000; name: "unauthorized"; msg: "unauthorized" },
    { code: 6001; name: "invalidState"; msg: "Invalid state" },
    { code: 6002; name: "alreadyExists"; msg: "Already exists" },
    { code: 6003; name: "notFound"; msg: "Not found" },
    { code: 6004; name: "listingActive"; msg: "Listing is active" },
    { code: 6005; name: "listingNotFound"; msg: "Listing not found" },
    { code: 6006; name: "selfDealNotAllowed"; msg: "Self deal is not allowed" },
    { code: 6007; name: "insufficientPayment"; msg: "Insufficient payment" },
    { code: 6008; name: "priceMismatch"; msg: "Price mismatch" },
    { code: 6009; name: "feeTooHigh"; msg: "Fee basis points exceed limit" },
    { code: 6010; name: "expired"; msg: "expired" },
  ]
  types: [
    {
      name: "config"
      type: {
        kind: "struct"
        fields: [
          { name: "feeBps"; type: "u16" },
          { name: "treasury"; type: "pubkey" },
          { name: "governance"; type: "pubkey" },
          { name: "bump"; type: "u8" },
        ]
      }
    },
    {
      name: "configUpdated"
      type: {
        kind: "struct"
        fields: [{ name: "feeBps"; type: "u16" }, { name: "treasury"; type: "pubkey" }]
      }
    },
    {
      name: "delisted"
      type: {
        kind: "struct"
        fields: [{ name: "itemId"; type: "u64" }, { name: "seller"; type: "pubkey" }]
      }
    },
    {
      name: "item"
      type: {
        kind: "struct"
        fields: [
          { name: "itemId"; type: "u64" },
          { name: "skuHash"; type: { array: ["u8", 32] } },
          { name: "vaultHash"; type: { array: ["u8", 32] } },
          { name: "status"; type: { defined: { name: "itemStatus" } } },
          { name: "currentOwner"; type: "pubkey" },
          { name: "createdAt"; type: "i64" },
          { name: "bump"; type: "u8" },
        ]
      }
    },
    {
      name: "itemIntaked"
      type: {
        kind: "struct"
        fields: [{ name: "itemId"; type: "u64" }, { name: "owner"; type: "pubkey" }]
      }
    },
    {
      name: "itemStatus"
      type: {
        kind: "enum"
        variants: [
          { name: "inVault" },
          { name: "listed" },
          { name: "sold" },
          { name: "redeemPending" },
          { name: "redeemed" },
        ]
      }
    },
    {
      name: "listed"
      type: {
        kind: "struct"
        fields: [
          { name: "itemId"; type: "u64" },
          { name: "seller"; type: "pubkey" },
          { name: "priceLamports"; type: "u64" },
        ]
      }
    },
    {
      name: "listing"
      type: {
        kind: "struct"
        fields: [
          { name: "item"; type: "pubkey" },
          { name: "seller"; type: "pubkey" },
          { name: "priceLamports"; type: "u64" },
          { name: "expiresAt"; type: "i64" },
          { name: "active"; type: "bool" },
          { name: "bump"; type: "u8" },
        ]
      }
    },
    {
      name: "receipt"
      type: {
        kind: "struct"
        fields: [
          { name: "item"; type: "pubkey" },
          { name: "owner"; type: "pubkey" },
          { name: "state"; type: { defined: { name: "itemStatus" } } },
          { name: "bump"; type: "u8" },
        ]
      }
    },
    {
      name: "receiptMinted"
      type: {
        kind: "struct"
        fields: [{ name: "itemId"; type: "u64" }, { name: "owner"; type: "pubkey" }]
      }
    },
    {
      name: "redeemConfirmed"
      type: {
        kind: "struct"
        fields: [
          { name: "itemId"; type: "u64" },
          { name: "owner"; type: "pubkey" },
          { name: "warehouseRef"; type: "string" },
        ]
      }
    },
    {
      name: "redeemRequested"
      type: {
        kind: "struct"
        fields: [{ name: "itemId"; type: "u64" }, { name: "owner"; type: "pubkey" }]
      }
    },
    {
      name: "tradeSettled"
      type: {
        kind: "struct"
        fields: [
          { name: "itemId"; type: "u64" },
          { name: "priceLamports"; type: "u64" },
          { name: "feeLamports"; type: "u64" },
          { name: "seller"; type: "pubkey" },
          { name: "buyer"; type: "pubkey" },
        ]
      }
    },
  ]
}

export const KAIWU_PROGRAM_ID = "62XmxPoMk15LdgH8a8UWgyj9wLTXfjcswL3UDBVSS8NG"

export const IDL: Kaiwu = {
  address: "62XmxPoMk15LdgH8a8UWgyj9wLTXfjcswL3UDBVSS8NG",
  metadata: {
    name: "kaiwu",
    version: "0.1.0",
    spec: "0.1.0",
    description: "Created with Anchor",
  },
  instructions: [
    {
      name: "buyItem",
      discriminator: [80, 82, 193, 201, 216, 27, 70, 184],
      accounts: [
        { name: "config", pda: { seeds: [{ kind: "const", value: [99, 111, 110, 102, 105, 103] }] } },
        { name: "item", writable: true },
        { name: "receipt", writable: true },
        { name: "listing", writable: true },
        { name: "buyer", writable: true, signer: true },
        { name: "seller", writable: true, relations: ["listing"] },
        { name: "treasury", writable: true },
        { name: "systemProgram", address: "11111111111111111111111111111111" },
      ],
      args: [],
    },
    {
      name: "delistItem",
      discriminator: [243, 224, 175, 39, 170, 10, 179, 114],
      accounts: [
        { name: "item", writable: true },
        { name: "receipt", writable: true },
        { name: "listing", writable: true },
        { name: "currentOwner", writable: true, signer: true, relations: ["item"] },
        { name: "owner", relations: ["receipt"] },
        { name: "seller", relations: ["listing"] },
      ],
      args: [],
    },
    {
      name: "initConfig",
      discriminator: [23, 235, 115, 232, 168, 96, 1, 231],
      accounts: [
        { name: "config", pda: { seeds: [{ kind: "const", value: [99, 111, 110, 102, 105, 103] }] } },
        { name: "governance", writable: true, signer: true },
        { name: "systemProgram", address: "11111111111111111111111111111111" },
      ],
      args: [
        { name: "feeBps", type: "u16" },
        { name: "treasury", type: "pubkey" },
        { name: "governance", type: "pubkey" },
      ],
    },
    {
      name: "intakeItem",
      discriminator: [164, 181, 197, 11, 108, 13, 104, 145],
      accounts: [
        { name: "config", pda: { seeds: [{ kind: "const", value: [99, 111, 110, 102, 105, 103] }] } },
        {
          name: "item",
          writable: true,
          pda: {
            seeds: [
              { kind: "const", value: [105, 116, 101, 109] },
              { kind: "arg", path: "itemId" },
            ],
          },
        },
        {
          name: "receipt",
          writable: true,
          pda: {
            seeds: [
              { kind: "const", value: [114, 101, 99, 101, 105, 112, 116] },
              { kind: "account", path: "item" },
            ],
          },
        },
        { name: "initialOwner" },
        { name: "operator", writable: true, signer: true },
        { name: "systemProgram", address: "11111111111111111111111111111111" },
      ],
      args: [
        { name: "itemId", type: "u64" },
        { name: "skuHash", type: { array: ["u8", 32] } },
        { name: "vaultHash", type: { array: ["u8", 32] } },
      ],
    },
    {
      name: "listItem",
      discriminator: [174, 245, 22, 211, 228, 103, 121, 13],
      accounts: [
        { name: "item", writable: true },
        { name: "receipt", writable: true },
        {
          name: "listing",
          writable: true,
          pda: {
            seeds: [
              { kind: "const", value: [108, 105, 115, 116, 105, 110, 103] },
              { kind: "account", path: "item" },
            ],
          },
        },
        { name: "currentOwner", writable: true, signer: true, relations: ["item"] },
        { name: "owner", relations: ["receipt"] },
        { name: "systemProgram", address: "11111111111111111111111111111111" },
      ],
      args: [
        { name: "priceLamports", type: "u64" },
        { name: "expiresAt", type: "i64" },
      ],
    },
    {
      name: "redeemConfirm",
      discriminator: [144, 38, 239, 89, 61, 150, 116, 161],
      accounts: [
        { name: "config", pda: { seeds: [{ kind: "const", value: [99, 111, 110, 102, 105, 103] }] } },
        { name: "item", writable: true },
        { name: "receipt", writable: true },
        { name: "operator", writable: true, signer: true },
      ],
      args: [{ name: "warehouseRef", type: "string" }],
    },
    {
      name: "redeemRequest",
      discriminator: [237, 30, 113, 222, 127, 230, 203, 243],
      accounts: [
        { name: "item", writable: true },
        { name: "receipt", writable: true },
        { name: "currentOwner", writable: true, signer: true, relations: ["item"] },
        { name: "owner", relations: ["receipt"] },
      ],
      args: [],
    },
  ],
  accounts: [
    { name: "config", discriminator: [155, 12, 170, 224, 30, 250, 204, 130] },
    { name: "item", discriminator: [92, 157, 163, 130, 72, 254, 86, 216] },
    { name: "listing", discriminator: [218, 32, 50, 73, 43, 134, 26, 58] },
    { name: "receipt", discriminator: [39, 154, 73, 106, 80, 102, 145, 153] },
  ],
  events: [
    { name: "configUpdated", discriminator: [40, 241, 230, 122, 11, 19, 198, 194] },
    { name: "delisted", discriminator: [127, 52, 154, 240, 230, 144, 87, 87] },
    { name: "itemIntaked", discriminator: [89, 1, 28, 250, 123, 189, 11, 60] },
    { name: "listed", discriminator: [243, 173, 136, 195, 125, 241, 12, 99] },
    { name: "receiptMinted", discriminator: [100, 166, 3, 33, 2, 189, 140, 144] },
    { name: "redeemConfirmed", discriminator: [48, 53, 239, 254, 112, 179, 33, 99] },
    { name: "redeemRequested", discriminator: [5, 130, 67, 249, 243, 168, 11, 88] },
    { name: "tradeSettled", discriminator: [22, 119, 166, 225, 175, 53, 93, 216] },
  ],
  errors: [
    { code: 6000, name: "unauthorized", msg: "unauthorized" },
    { code: 6001, name: "invalidState", msg: "Invalid state" },
    { code: 6002, name: "alreadyExists", msg: "Already exists" },
    { code: 6003, name: "notFound", msg: "Not found" },
    { code: 6004, name: "listingActive", msg: "Listing is active" },
    { code: 6005, name: "listingNotFound", msg: "Listing not found" },
    { code: 6006, name: "selfDealNotAllowed", msg: "Self deal is not allowed" },
    { code: 6007, name: "insufficientPayment", msg: "Insufficient payment" },
    { code: 6008, name: "priceMismatch", msg: "Price mismatch" },
    { code: 6009, name: "feeTooHigh", msg: "Fee basis points exceed limit" },
    { code: 6010, name: "expired", msg: "expired" },
  ],
  types: [
    {
      name: "config",
      type: {
        kind: "struct",
        fields: [
          { name: "feeBps", type: "u16" },
          { name: "treasury", type: "pubkey" },
          { name: "governance", type: "pubkey" },
          { name: "bump", type: "u8" },
        ],
      },
    },
    {
      name: "configUpdated",
      type: {
        kind: "struct",
        fields: [
          { name: "feeBps", type: "u16" },
          { name: "treasury", type: "pubkey" },
        ],
      },
    },
    {
      name: "delisted",
      type: {
        kind: "struct",
        fields: [
          { name: "itemId", type: "u64" },
          { name: "seller", type: "pubkey" },
        ],
      },
    },
    {
      name: "item",
      type: {
        kind: "struct",
        fields: [
          { name: "itemId", type: "u64" },
          { name: "skuHash", type: { array: ["u8", 32] } },
          { name: "vaultHash", type: { array: ["u8", 32] } },
          { name: "status", type: { defined: { name: "itemStatus" } } },
          { name: "currentOwner", type: "pubkey" },
          { name: "createdAt", type: "i64" },
          { name: "bump", type: "u8" },
        ],
      },
    },
    {
      name: "itemIntaked",
      type: {
        kind: "struct",
        fields: [
          { name: "itemId", type: "u64" },
          { name: "owner", type: "pubkey" },
        ],
      },
    },
    {
      name: "itemStatus",
      type: {
        kind: "enum",
        variants: [
          { name: "inVault" },
          { name: "listed" },
          { name: "sold" },
          { name: "redeemPending" },
          { name: "redeemed" },
        ],
      },
    },
    {
      name: "listed",
      type: {
        kind: "struct",
        fields: [
          { name: "itemId", type: "u64" },
          { name: "seller", type: "pubkey" },
          { name: "priceLamports", type: "u64" },
        ],
      },
    },
    {
      name: "listing",
      type: {
        kind: "struct",
        fields: [
          { name: "item", type: "pubkey" },
          { name: "seller", type: "pubkey" },
          { name: "priceLamports", type: "u64" },
          { name: "expiresAt", type: "i64" },
          { name: "active", type: "bool" },
          { name: "bump", type: "u8" },
        ],
      },
    },
    {
      name: "receipt",
      type: {
        kind: "struct",
        fields: [
          { name: "item", type: "pubkey" },
          { name: "owner", type: "pubkey" },
          { name: "state", type: { defined: { name: "itemStatus" } } },
          { name: "bump", type: "u8" },
        ],
      },
    },
    {
      name: "receiptMinted",
      type: {
        kind: "struct",
        fields: [
          { name: "itemId", type: "u64" },
          { name: "owner", type: "pubkey" },
        ],
      },
    },
    {
      name: "redeemConfirmed",
      type: {
        kind: "struct",
        fields: [
          { name: "itemId", type: "u64" },
          { name: "owner", type: "pubkey" },
          { name: "warehouseRef", type: "string" },
        ],
      },
    },
    {
      name: "redeemRequested",
      type: {
        kind: "struct",
        fields: [
          { name: "itemId", type: "u64" },
          { name: "owner", type: "pubkey" },
        ],
      },
    },
    {
      name: "tradeSettled",
      type: {
        kind: "struct",
        fields: [
          { name: "itemId", type: "u64" },
          { name: "priceLamports", type: "u64" },
          { name: "feeLamports", type: "u64" },
          { name: "seller", type: "pubkey" },
          { name: "buyer", type: "pubkey" },
        ],
      },
    },
  ],
} as const
