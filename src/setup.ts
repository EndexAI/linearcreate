import fs from 'fs';
import readline from 'readline';
import path from 'path';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const envPath = path.join(process.cwd(), '.env');

console.log('Welcome to linearcreate setup!');

export function runSetup() {
  return new Promise<void>((resolve) => {
    rl.question('Enter your Linear API key: ', (apiKey) => {
      rl.question('Enter your default team stub: ', (teamStub) => {
        rl.question('Enter your user ID: ', (userId) => {
          const envContent = `LINEAR_API_KEY=${apiKey}\nDEFAULT_TEAM_STUB=${teamStub}\nUSER_ID=${userId}\n`;
          
          fs.writeFileSync(envPath, envContent);
          console.log('.env file created successfully!');
          rl.close();
          resolve();
        });
      });
    });
  });
}

if (require.main === module) {
  runSetup();
}