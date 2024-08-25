#!/usr/bin/env node

import { LinearClient } from "@linear/sdk";
import clipboardy from "clipboardy";
import dotenv from "dotenv";
import open from "open";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

if (!process.env.LINEAR_API_KEY || !process.env.USER_ID || !process.env.DEFAULT_TEAM_STUB) {
  console.error("Error: LINEAR_API_KEY, USER_ID, or DEFAULT_TEAM_STUB is not set in your environment variables.");
  process.exit(1);
}

const linearClient = new LinearClient({ apiKey: process.env.LINEAR_API_KEY });

async function createIssueWithBranch(title: string, teamStub: string) {
  try {
    // Fetch the organization
    const organization = await linearClient.organization;

    // Fetch the teams
    const teams = await organization.teams();
    const team = teams.nodes.find(
      (t) => t.key.toLowerCase() === teamStub.toLowerCase()
    );
    if (!team) {
      throw new Error(`No team found with stub: ${teamStub}`);
    }

    // Create the issue
    const issuePayload = await linearClient.createIssue({
      title,
      teamId: team.id,
      assigneeId: process.env.USER_ID,
    });

    if (!issuePayload.success || !issuePayload.issue) {
      throw new Error("Failed to create issue");
    }

    const issue = await issuePayload.issue;

    // Generate the branch name
    const sanitizedTitle = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .substring(0, 50); // Limit length to 50 characters

    // Fetch the user
    if (!process.env.USER_ID) {
      throw new Error("USER_ID is not set in your environment variables.");
    }
    const user = await linearClient.user(process.env.USER_ID);
    if (!user) {
      throw new Error("Failed to fetch user");
    }

    const branchName = `${user.name.toLowerCase().replace(/\s+/g, '')}/${issue.identifier.toLowerCase()}-${sanitizedTitle}`;

    return { issue, branchName };
  } catch (error) {
    throw error;
  }
}

async function main() {
  const argv = await yargs(hideBin(process.argv))
    .command(
      "$0 <ticketName>",
      "Create a new Linear issue and generate a branch name",
      (yargs: any) => {
        return yargs
          .positional("ticketName", {
            describe: "Name of the ticket",
            type: "string",
            demandOption: true,
          })
          .option("teamstub", {
            alias: "t",
            type: "string",
            description: "Team stub (e.g., bknd, frtd)",
            default: process.env.DEFAULT_TEAM_STUB,
          })
          .option("open", {
            alias: "o",
            type: "boolean",
            description: "Open the ticket in Linear",
            default: false,
          });
      }
    )
    .help()
    .parse();

  try {
    const { issue, branchName } = await createIssueWithBranch(
      argv.ticketName as string,
      argv.teamstub as string
    );

    if (argv.open) {
      console.log(`Opening issue in Linear: ${issue.url}`);
      await open(issue.url);
    } else {
      await clipboardy.write(branchName);
      console.log(`Branch name copied to clipboard: ${branchName}`);
    }

    console.log(`Issue created: ${issue.title} (${issue.identifier})`);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();