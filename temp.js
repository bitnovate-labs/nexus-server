const keyMapping = {
  // ﻿No: "No",
  // AgentId: "agent_id",
  Name: "name",
  NickName: "display_name",
  // FullName: "full_name", - NOT REQUIRED
  // Code: "code", - NOT REQUIRED
  // Prefix: "prefix", - NOT REQUIRED
  NRIC: "nric_passport",
  Email: "email",
  Mobile: "mobile",
  Address: "address",
  PayeeName: "payee_name",
  PayeeNRIC: "payee_nric",
  // PayeeNRICTypeId: "payee_nric_type_id", - NOT REQUIRED
  PayeeNRICType: "payee_nric_type",
  // BankId: "bank_id",
  Bank: "bank",
  BankAccountNo: "bank_account_no",
  SWIFTCode: "swift_code",
  RENCode: "ren_no",
  RENLicense: "ren_license",
  RENExpiredDate: "ren_expired_date",
  // PrefixIncomeTaxNo: "prefix_income_tax_no", - NOT REQUIRED
  IncomeTaxNo: "income_tax_no",
  BranchId: "branch_id",
  // Branch: "branch",
  LeaderId: "leader_id",
  Leader: "leader",
  SponsorId: "recruiter_id",
  // Sponsor: "sponsor",
  DesignationId: "designation_id",
  // Designation: "designation",
  JoinDate: "join_date",
  ResignDate: "resign_date",
  // IsLeaderboard: "is_leaderboard",
  Leaderboard: "leaderboard",
  // IsActive: "is_active",
  Active: "active",
  // IsWithholdingTax: "is_withholding_tax",
  WithholdingTax: "withholding_tax",
  Remark: "remark",
  // ImageUrl: "image_url",
  // ImagePath: "image_path",
  // CreatedById: "created_by_id",
  CreatedBy: "created_by",
  CreatedDate: "created_at",
  // LastModifiedById: "last_modified_by_id",
  LastModifiedBy: "last_modified_by",
  LastModifiedDate: "last_modified_at",
};

// MOCK DATA
{
    "agents": [
      {
        "name": "Alice Wong",
        "display_name": "AliceW",
        "nric_passport": "S1010101A",
        "email": "alicewong@example.com",
        "mobile": "+60 12-3456 9876",
        "address": "101, Jalan ABC, 12345 Kuala Lumpur, Malaysia",
        "payee_name": "Alice Wong Ltd.",
        "payee_nric": "S1010101A",
        "payee_nric_type": "NRIC",
        "ren_no": "REN10101",
        "ren_license": "REN10101-234567",
        "ren_expired_date": "2025-11-30",
        "bank_account_no": "123-456-789012",
        "commission_percentage": 2.5,
        "join_date": "2023-02-15",
        "resign_date": null,
        "income_tax_no": "TX1010101",
        "withholding_tax": false,
        "leaderboard": true,
        "active": true,
        "remark": "Outstanding performance in Q1 2024."
      },
      {
        "name": "Michael Tan",
        "display_name": "MichaelT",
        "nric_passport": "S1122334B",
        "email": "michaeltan@example.com",
        "mobile": "+60 13-6543 2109",
        "address": "202, Jalan XYZ, 54321 Penang, Malaysia",
        "payee_name": "Michael Tan Holdings",
        "payee_nric": "S1122334B",
        "payee_nric_type": "NRIC",
        "ren_no": "REN22334",
        "ren_license": "REN22334-345678",
        "ren_expired_date": "2024-12-31",
        "bank_account_no": "234-567-890123",
        "commission_percentage": 3.0,
        "join_date": "2022-06-18",
        "resign_date": null,
        "income_tax_no": "TX1122334",
        "withholding_tax": true,
        "leaderboard": false,
        "active": true,
        "remark": "Has shown steady growth in sales."
      },
      {
        "name": "Cynthia Lim",
        "display_name": "CynthiaL",
        "nric_passport": "S2233445C",
        "email": "cynthialim@example.com",
        "mobile": "+60 14-2345 6789",
        "address": "303, Jalan DEF, 67890 Johor Bahru, Malaysia",
        "payee_name": "Cynthia Lim Ventures",
        "payee_nric": "S2233445C",
        "payee_nric_type": "NRIC",
        "ren_no": "REN33445",
        "ren_license": "REN33445-456789",
        "ren_expired_date": "2025-06-30",
        "bank_account_no": "345-678-901234",
        "commission_percentage": 1.8,
        "join_date": "2021-07-22",
        "resign_date": null,
        "income_tax_no": "TX2233445",
        "withholding_tax": false,
        "leaderboard": false,
        "active": true,
        "remark": "Solid growth but needs to improve in client retention."
      },
      {
        "name": "Steven Ng",
        "display_name": "StevenN",
        "nric_passport": "S3344556D",
        "email": "stevenng@example.com",
        "mobile": "+60 15-3456 7890",
        "address": "404, Jalan GHI, 89012 Melaka, Malaysia",
        "payee_name": "Steven Ng Consulting",
        "payee_nric": "S3344556D",
        "payee_nric_type": "NRIC",
        "ren_no": "REN44556",
        "ren_license": "REN44556-567890",
        "ren_expired_date": "2024-08-15",
        "bank_account_no": "456-789-012345",
        "commission_percentage": 2.0,
        "join_date": "2020-04-25",
        "resign_date": null,
        "income_tax_no": "TX3344556",
        "withholding_tax": true,
        "leaderboard": true,
        "active": false,
        "remark": "Currently on maternity leave."
      },
      {
        "name": "Laura Chen",
        "display_name": "LauraC",
        "nric_passport": "S4455667E",
        "email": "laurachen@example.com",
        "mobile": "+60 16-4567 8901",
        "address": "505, Jalan JKL, 34567 Sabah, Malaysia",
        "payee_name": "Laura Chen Group",
        "payee_nric": "S4455667E",
        "payee_nric_type": "NRIC",
        "ren_no": "REN55667",
        "ren_license": "REN55667-678901",
        "ren_expired_date": "2026-03-10",
        "bank_account_no": "567-890-123456",
        "commission_percentage": 1.7,
        "join_date": "2019-02-10",
        "resign_date": null,
        "income_tax_no": "TX4455667",
        "withholding_tax": false,
        "leaderboard": false,
        "active": true,
        "remark": "Shows great potential but needs more training."
      },
      {
        "name": "Gary Tan",
        "display_name": "GaryT",
        "nric_passport": "S5566778F",
        "email": "garytan@example.com",
        "mobile": "+60 17-5678 9012",
        "address": "606, Jalan MNO, 45678 Kuala Lumpur, Malaysia",
        "payee_name": "Gary Tan Solutions",
        "payee_nric": "S5566778F",
        "payee_nric_type": "NRIC",
        "ren_no": "REN66778",
        "ren_license": "REN66778-789012",
        "ren_expired_date": "2025-10-10",
        "bank_account_no": "678-901-234567",
        "commission_percentage": 2.3,
        "join_date": "2021-09-05",
        "resign_date": null,
        "income_tax_no": "TX5566778",
        "withholding_tax": false,
        "leaderboard": true,
        "active": true,
        "remark": "Consistent top performer."
      },
      {
        "name": "Rachel Ho",
        "display_name": "RachelH",
        "nric_passport": "S6677889G",
        "email": "rachelho@example.com",
        "mobile": "+60 18-6789 0123",
        "address": "707, Jalan PQR, 56789 Penang, Malaysia",
        "payee_name": "Rachel Ho Enterprises",
        "payee_nric": "S6677889G",
        "payee_nric_type": "NRIC",
        "ren_no": "REN77889",
        "ren_license": "REN77889-890123",
        "ren_expired_date": "2024-12-15",
        "bank_account_no": "789-012-345678",
        "commission_percentage": 2.1,
        "join_date": "2020-11-01",
        "resign_date": null,
        "income_tax_no": "TX6677889",
        "withholding_tax": false,
        "leaderboard": false,
        "active": true,
        "remark": "Fast learner, improving steadily."
      },
      {
        "name": "Ethan Lee",
        "display_name": "EthanL",
        "nric_passport": "S7788990H",
        "email": "ethanlee@example.com",
        "mobile": "+60 19-7890 1234",
        "address": "808, Jalan STU, 67890 Johor Bahru, Malaysia",
        "payee_name": "Ethan Lee Investments",
        "payee_nric": "S7788990H",
        "payee_nric_type": "NRIC",
        "ren_no": "REN88990",
        "ren_license": "REN88990-901234",
        "ren_expired_date": "2025-04-20",
        "bank_account_no": "890-123-456789",
        "commission_percentage": 1.9,
        "join_date": "2018-05-30",
        "resign_date": null,
        "income_tax_no": "TX7788990",
        "withholding_tax": true,
        "leaderboard": false,
        "active": true,
        "remark": "Steady performer with a loyal client base."
      },
      {
        "name": "Tommy Lee",
        "display_name": "TommyL",
        "nric_passport": "S8899001I",
        "email": "tommylee@example.com",
        "mobile": "+60 20-8901 2345",
        "address": "909, Jalan VWX, 78901 Melaka, Malaysia",
        "payee_name": "Tommy Lee Enterprises",
        "payee_nric": "S8899001I",
        "payee_nric_type": "NRIC",
        "ren_no": "REN99001",
        "ren_license": "REN99001-012345",
        "ren_expired_date": "2026-01-01",
        "bank_account_no": "901-234-567890",
        "commission_percentage": 2.4,
        "join_date": "2023-07-11",
        "resign_date": null,
        "income_tax_no": "TX8899001",
        "withholding_tax": false,
        "leaderboard": true,
        "active": true,
        "remark": "Excellent customer relationships."
      },
      {
        "name": "Samantha Wong",
        "display_name": "SamanthaW",
        "nric_passport": "S9900112J",
        "email": "samanthawong@example.com",
        "mobile": "+60 21-9012 3456",
        "address": "1010, Jalan YZ, 89012 Kuala Lumpur, Malaysia",
        "payee_name": "Samantha Wong Consulting",
        "payee_nric": "S9900112J",
        "payee_nric_type": "NRIC",
        "ren_no": "REN10112",
        "ren_license": "REN10112-123456",
        "ren_expired_date": "2025-05-15",
        "bank_account_no": "012-345-678901",
        "commission_percentage": 3.0,
        "join_date": "2017-12-25",
        "resign_date": null,
        "income_tax_no": "TX9900112",
        "withholding_tax": false,
        "leaderboard": false,
        "active": true,
        "remark": "Quick to adapt to changing market conditions."
      },
      {
        "name": "Oscar Tan",
        "display_name": "OscarT",
        "nric_passport": "S1011122K",
        "email": "oscartan@example.com",
        "mobile": "+60 22-0123 4567",
        "address": "1111, Jalan ABC, 23456 Johor Bahru, Malaysia",
        "payee_name": "Oscar Tan Ventures",
        "payee_nric": "S1011122K",
        "payee_nric_type": "NRIC",
        "ren_no": "REN11222",
        "ren_license": "REN11222-234567",
        "ren_expired_date": "2025-02-28",
        "bank_account_no": "123-456-789012",
        "commission_percentage": 2.0,
        "join_date": "2021-08-05",
        "resign_date": null,
        "income_tax_no": "TX1011122",
        "withholding_tax": false,
        "leaderboard": true,
        "active": true,
        "remark": "Very proactive in client outreach."
      }
    ],
    "banks": [
      {
        "name": "Malayan Banking Berhad (Maybank)",
        "swift_code": "MBBEMYKL",
        "active": "Yes"
      },
      {
        "name": "CIMB Bank Berhad",
        "swift_code": "CIBBMYKL",
        "active": "Yes"
      },
      {
        "name": "Public Bank Berhad",
        "swift_code": "PBBEMYKL",
        "active": "Yes"
      },
      {
        "name": "RHB Bank Berhad",
        "swift_code": "RHBBMYKL",
        "active": "Yes"
      },
      {
        "name": "Hong Leong Bank Berhad",
        "swift_code": "HLBBMYKL",
        "active": "Yes"
      },
      {
        "name": "Affin Bank Berhad",
        "swift_code": "PHBAMYKL",
        "active": "No"
      },
      {
        "name": "AmBank (M) Berhad",
        "swift_code": "ARBMYSKL",
        "active": "Yes"
      },
      {
        "name": "Bank Simpanan Nasional (BSN)",
        "swift_code": "BSNMYSKAXXX",
        "active": "Yes"
      },
      {
        "name": "UOB Malaysia",
        "swift_code": "UOVBMYKL",
        "active": "Yes"
      },
      {
        "name": "Bank Islam Malaysia Berhad",
        "swift_code": "BIMBMYKL",
        "active": "No"
      }
    ],
    "branches": [
      {
        "name": "Kuala Lumpur",
        "max_agents": 100,
        "active": true
      }
    ],
    "companies": [
      {
        "name": "Connexus Realty",
        "display_name": "Connexus Realty",
        "registration_no": "",
        "license_no": "E(3)1960",
        "income_tax_no": "",
        "address": "0.73A Wisma LKT Jalan Nadchatiram, Taman Taynton View, 56000 Cheras, Kuala Lumpur.",
        "contact_no": "",
        "fax": "",
        "email": "",
        "website": "",
        "sst": true,
        "sst_no": "",
        "person_in_charge": "",
        "person_in_charge_nric": "",
        "person_in_charge_designation": ""
      }
    ],
    "designations": [
      { "name": "Agent", "rank": 1, "active": true },
      { "name": "Pre Leader", "rank": 2, "active": true },
      { "name": "Leader", "rank": 3, "active": true },
      { "name": "Senior Leader", "rank": 4, "active": true },
      { "name": "Management", "rank": 5, "active": true }
    ],
    "developers": [
      {
        "name": "Tropicana Builders Sdn Bhd",
        "registration_no": "123456-X",
        "address": "No. 18, Jalan Tropicana Utara, 47410 Petaling Jaya, Selangor, Malaysia",
        "contact_person": "Mr. Alan Tan",
        "contact_no": "+60 3-7888 1234"
      },
      {
        "name": "Sunrise Properties Sdn Bhd",
        "registration_no": "654321-M",
        "address": "Level 12, Tower B, Plaza Sentral, Jalan Stesen Sentral 5, 50470 Kuala Lumpur, Malaysia",
        "contact_person": "Ms. Jessica Wong",
        "contact_no": "+60 3-2272 5678"
      },
      {
        "name": "Eco Living Development Berhad",
        "registration_no": "789012-H",
        "address": "Lot 6, Jalan Teknologi, Taman Teknologi Malaysia, 57000 Kuala Lumpur, Malaysia",
        "contact_person": "Mr. Samuel Lee",
        "contact_no": "+60 3-6196 7890"
      },
      {
        "name": "GreenField Builders Sdn Bhd",
        "registration_no": "345678-W",
        "address": "Suite 25-01, Level 25, Wisma GreenField, Jalan Tun Razak, 50450 Kuala Lumpur, Malaysia",
        "contact_person": "Ms. Nur Aisyah Binti Azman",
        "contact_no": "+60 3-9200 1234"
      },
      {
        "name": "Azure Developments Sdn Bhd",
        "registration_no": "567890-Y",
        "address": "No. 15, Jalan Permata 3, Taman Permata, 68000 Ampang, Selangor, Malaysia",
        "contact_person": "Mr. Farid Abdullah",
        "contact_no": "+60 3-4105 6789"
      }
    ],
    "projects": [
      {
        "company_id": 1,
        "name": "Tropicana Heights Residences",
        "developer_id": 1,
        "developer_pay_tax": true,
        "state_id": 2,
        "description": "A luxurious gated community offering modern living with extensive green spaces and recreational facilities.",
        "active": true
      },
      {
        "company_id": 1,
        "name": "Azure Sky Apartments",
        "developer_id": 2,
        "developer_pay_tax": false,
        "state_id": 4,
        "description": "Affordable high-rise apartments with a focus on sustainability and eco-friendly architecture.",
        "active": true
      },
      {
        "company_id": 1,
        "name": "Eco Valley Homes",
        "developer_id": 3,
        "developer_pay_tax": true,
        "state_id": 7,
        "description": "A serene development in the heart of nature, perfect for families seeking tranquility.",
        "active": false
      },
      {
        "company_id": 1,
        "name": "Sunrise Park Villas",
        "developer_id": 4,
        "developer_pay_tax": false,
        "state_id": 8,
        "description": "An exclusive collection of luxury villas located in a prestigious suburban area.",
        "active": true
      },
      {
        "company_id": 1,
        "name": "Urban Vista Towers",
        "developer_id": 5,
        "developer_pay_tax": true,
        "state_id": 10,
        "description": "A mixed-use development featuring retail spaces and residential units in the city center.",
        "active": false
      }
    ],
    "sales_stages": [
      {
        "sales_type": "SUBSALES",
        "name": "Booking",
        "level": 1,
        "active": true
      },
      {
        "sales_type": "SUBSALES",
        "name": "Convert",
        "level": 2,
        "active": true
      },
      {
        "sales_type": "SUBSALES",
        "name": "Void",
        "level": 3,
        "active": true
      },
      {
        "sales_type": "RENT",
        "name": "Booking",
        "level": 1,
        "active": true
      },
      {
        "sales_type": "RENT",
        "name": "Convert",
        "level": 2,
        "active": true
      },
      {
        "sales_type": "RENT",
        "name": "Void",
        "level": 3,
        "active": true
      },
      {
        "sales_type": "PROJECT",
        "name": "Booking",
        "level": 1,
        "active": true
      },
      {
        "sales_type": "PROJECT",
        "name": "Convert",
        "level": 2,
        "active": true
      },
      {
        "sales_type": "PROJECT",
        "name": "Void",
        "level": 3,
        "active": true
      }
    ],
    "states": [
      {
        "name": "Johor",
        "code": "JHR",
        "country": "Malaysia"
      },
      {
        "name": "Kedah",
        "code": "KDH",
        "country": "Malaysia"
      },
      {
        "name": "Kelantan",
        "code": "KTN",
        "country": "Malaysia"
      },
      {
        "name": "Melaka",
        "code": "MLK",
        "country": "Malaysia"
      },
      {
        "name": "Negeri Sembilan",
        "code": "NSN",
        "country": "Malaysia"
      },
      {
        "name": "Pahang",
        "code": "PHG",
        "country": "Malaysia"
      },
      {
        "name": "Perak",
        "code": "PRK",
        "country": "Malaysia"
      },
      {
        "name": "Perlis",
        "code": "PLS",
        "country": "Malaysia"
      },
      {
        "name": "Penang",
        "code": "PNG",
        "country": "Malaysia"
      },
      {
        "name": "Sabah",
        "code": "SBH",
        "country": "Malaysia"
      },
      {
        "name": "Sarawak",
        "code": "SWK",
        "country": "Malaysia"
      },
      {
        "name": "Selangor",
        "code": "SGR",
        "country": "Malaysia"
      },
      {
        "name": "Terengganu",
        "code": "TRG",
        "country": "Malaysia"
      },
      {
        "name": "Kuala Lumpur",
        "code": "KUL",
        "country": "Malaysia"
      },
      {
        "name": "Labuan",
        "code": "LBN",
        "country": "Malaysia"
      },
      {
        "name": "Putrajaya",
        "code": "PJY",
        "country": "Malaysia"
      }
    ],
    "taxes": [
      {
        "code": "SV6",
        "name": "Standard Service Tax 6%",
        "tax_type": "Supply",
        "rate": 6,
        "tax_default": false,
        "created_by": 1,
        "last_modified_by": 1
      },
      {
        "code": "SVE",
        "name": "Service Tax Exempted",
        "tax_type": "Purchase",
        "rate": 0,
        "tax_default": false,
        "created_by": 1,
        "last_modified_by": 1
      },
      {
        "code": "SUV6",
        "name": "Service Tax For Own Use",
        "tax_type": "Supply",
        "rate": 6,
        "tax_default": false,
        "created_by": 1,
        "last_modified_by": 1
      },
      {
        "code": "SV8",
        "name": "Standard Service Tax 8%",
        "tax_type": "Supply",
        "rate": 8,
        "tax_default": true,
        "created_by": 1,
        "last_modified_by": 1
      }
    ]
  }
  