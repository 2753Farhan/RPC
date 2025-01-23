// server.js
import { loadPackageDefinition, Server, status, ServerCredentials } from '@grpc/grpc-js';
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

// Implement the CalculateFactorial RPC method
function calculateFactorial(number) {
    if (number === 0 || number === 1) return 1;
    return number * calculateFactorial(number - 1);
}

// Create gRPC server
const server = new Server();
server.addService(factorial.FactorialService.service, {
    calculateFactorial: (call, callback) => {
        const number = call.request.number;

        try {
            const result = calculateFactorial(number);
            callback(null, { result });
        } catch (error) {
            callback({
                code: status.INVALID_ARGUMENT,
                message: error.message
            });
        }
    }
});

// Start server
server.bindAsync(
    '0.0.0.0:50051',
    ServerCredentials.createInsecure(),
    (error, port) => {
        if (error) {
            console.error(error);
            return;
        }
        server.start();
        console.log(`Server running at 0.0.0.0:${port}`);
    }
);
