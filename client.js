import { loadPackageDefinition, credentials } from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load proto file
const PROTO_PATH = join(__dirname, 'factorial.proto');
const packageDefinition = loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const protoDescriptor = loadPackageDefinition(packageDefinition);
const factorial = protoDescriptor.factorial;

// Create gRPC client
const client = new factorial.FactorialService(
    'localhost:50051',
    credentials.createInsecure()
);

// Example usage
function calculateFactorial(number) {
    return new Promise((resolve, reject) => {
        client.calculateFactorial({ number }, (error, response) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(response.result);
        });
    });
}

// Test the service
async function main() {
    try {
        const number = 5;
        const result = await calculateFactorial(number);
        console.log(`Factorial of ${number} is: ${result}`);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
