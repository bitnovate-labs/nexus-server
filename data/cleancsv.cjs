const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

// Path to the CSV file
const csvFilePath = path.join(__dirname, "agent.csv");

// Function to clean the data
function cleanData(messyData) {
  const keyMapping = {
    Name: "name",
    NickName: "display_name",
    NRIC: "nric_passport",
    Email: "email",
    Mobile: "mobile",
    Address: "address",
    PayeeName: "payee_name",
    PayeeNRIC: "payee_nric",
    PayeeNRICType: "payee_nric_type",
    Bank: "bank",
    BankAccountNo: "bank_account_no",
    SWIFTCode: "swift_code",
    RENCode: "ren_no",
    RENLicense: "ren_license",
    RENExpiredDate: "ren_expired_date",
    IncomeTaxNo: "income_tax_no",
    BranchId: "branch_id",
    LeaderId: "leader_id",
    Leader: "leader",
    SponsorId: "recruiter_id",
    DesignationId: "designation_id",
    JoinDate: "join_date",
    ResignDate: "resign_date",
    Leaderboard: "leaderboard",
    Active: "active",
    WithholdingTax: "withholding_tax",
    Remark: "remark",
    CreatedBy: "created_by",
    CreatedDate: "created_at",
    LastModifiedBy: "last_modified_by",
    LastModifiedDate: "last_modified_at",
  };

  // Fields that should be treated as integers
  const integerFields = [
    "branch_id",
    "leader_id",
    "recruiter_id",
    "designation_id",
  ];

  // Fields that should be converted from "Yes"/"No" to true/false
  const booleanFields = ["leaderboard", "active", "withholding_tax"];

  return messyData.map((item) => {
    const cleanedItem = {};

    Object.keys(item).forEach((key) => {
      let value = item[key];

      // Only map if there's a valid key in the keyMapping
      if (keyMapping[key]) {
        const newKey = keyMapping[key]; // Map to the new key name

        // Remove leading/trailing quotes or ="...":
        value = value.replace(/^="?|"?$/g, "").trim();

        // Handle empty fields (convert "="" to an empty string):
        if (value === "") value = null;

        // Convert certain fields to integers
        if (integerFields.includes(newKey)) {
          // Attempt to convert the value to an integer
          value = parseInt(value, 10);
          if (isNaN(value)) value = null; // If conversion fails, set it to null
        }

        // Convert "Yes" / "No" to true / false
        if (booleanFields.includes(newKey)) {
          if (value === "Yes") {
            value = true;
          } else if (value === "No") {
            value = false;
          }
        }

        cleanedItem[newKey] = value;
      }
    });

    return cleanedItem;
  });
}

// Read and parse the CSV file
const messyData = [];
fs.createReadStream(csvFilePath)
  .pipe(csv()) // Parse the CSV into JSON objects
  .on("data", (row) => {
    messyData.push(row);
  })
  .on("end", () => {
    console.log("CSV file successfully read.");

    // Clean the data
    // const cleanedData = cleanData(messyData);
    let cleanedData = cleanData(messyData);

    function assignIdsToAgents(cleanedData) {
      return cleanedData.map((agent, index) => {
        // Add an `id` field based on the agent's position in the list (1-based index)
        agent.id = index + 1;
        return agent;
      });
    }

    function updateLeaderIds(agents, removeId = false) {
      // Step 1: Create a mapping of leader names to their respective IDs
      const leaderMap = {};
      agents.forEach((agent) => {
        if (agent.display_name) {
          leaderMap[agent.display_name] = agent.id;
        }
      });

      // Step 2: Update each agent's leader_id based on the leaderMap
      return agents.map((agent) => {
        if (agent.leader && leaderMap[agent.leader]) {
          agent.leader_id = leaderMap[agent.leader]; // Assign the correct leader_id
        } else {
          agent.leader_id = null; // If leader is not found, set to null
        }

        // Step 3: Remove the `id` field if removeId is true
        if (removeId) {
          delete agent.id;
        }

        return agent;
      });
    }

    // Assign unique IDs to agents
    cleanedData = assignIdsToAgents(cleanedData);

    // Update leader_id based on leader name
    cleanedData = updateLeaderIds(cleanedData, true);

    // Output the cleaned data
    console.log(cleanedData);

    // Optionally write the cleaned data to a JSON file
    const jsonFilePath = path.join(__dirname, "data-cleaned.json");
    fs.writeFileSync(jsonFilePath, JSON.stringify(cleanedData, null, 4));
    console.log(`Cleaned data saved to ${jsonFilePath}`);
  })
  .on("error", (err) => {
    console.error("Error reading the CSV file:", err);
  });
