/**

 *                          Block class
 *  The Block class is a main component into any Blockchain platform,
 *  it will store the data and act as a dataset for your application.
 *  The class will expose a method to validate the data... The body of
 *  the block will contain an Object that contain the data to be stored,
 *  the data should be stored encoded.
 *  All the exposed methods should return a Promise to allow all the methods
 *  run asynchronous.
 */

const SHA256 = require('crypto-js/sha256');
const hex2ascii = require('hex2ascii');

class Block {

    // Constructor - argument data will be the object containing the transaction data
    constructor(data){
        this.hash = null;                                           // Hash of the block
        this.height = 0;                                            // Block Height (consecutive number of each block)
        this.body = Buffer.from(JSON.stringify(data)).toString('hex');   // Will contain the transactions stored in the block, by default it will encode the data
        this.time = 0;                                              // Timestamp for the Block creation
        this.previousBlockHash = null;                              // Reference to the previous Block Hash
    }

    /**
     *  validate() method will validate if the block has been tampered or not.
     *  Been tampered block data as a consecuence the hash of the block should be different.
     *  Steps:
     *  1. Return a new promise to allow the method be called asynchronous.
     *  2. Save the in auxiliary variable the current hash of the block (`this` represent the block object)
     *  3. Recalculate the hash of the entire block (Use SHA256 from crypto-js library)
     *  4. Compare if the auxiliary hash value is different from the calculated one.
     *  5. Resolve true or false depending if it is valid or not.
     *  Note: to access the class values inside a Promise code you need to create an auxiliary value `let self = this;`
     */
    validate() {
        let self = this;
        return new Promise((resolve, reject) => {

            // Save in auxiliary variable the current block hash
            let currentBH = self.hash;
			
			self.hash = null;

            // Recalculate the hash of the Block
            let newHash = SHA256(JSON.stringify(self)).toString();
			
		
			self.hash = currentBH;

            // Comparing if the hashes changed
            let result = newHash === self.hash;

            if (result) {
                // Returning the Block is valid
                resolve(true);
            } else {
                // Returning the Block is not valid
                reject(false);

            }
			
        });
    }

    /**
     *  Auxiliary Method to return the block body (decoding the data)
     *  Steps:
     *
     *  1. Use hex2ascii module to decode the data
     *  2. Because data is a javascript object use JSON.parse(string) to get the Javascript Object
     *  3. Resolve with the data and make sure that you don't need to return the data for the `genesis block`
     *     or Reject with an error.
     */
    getBData() {
        let self = this;
        return new Promise((resolve, reject) => {
            // Getting the encoded data saved in the Block
            let encodedData = self.body;

            // Decoding the data to retrieve the JSON representation of the object
            let decodedData = hex2ascii(encodedData);

            // Parse the data to an object to be retrieve.
            let parsedData = JSON.parse(decodedData);

            // Resolve with the data if the object isn't the Genesis block
            if (self.height === 0) { // Check if it's the genesis block
                resolve("Cannot retrieve data for the genesis block");
            }

            if (parsedData) {
                resolve(parsedData);
            } else {
                reject(new Error("Invalid data format in the block"));
            }
        });
    }
}

module.exports.Block = Block;                    // Exposing the Block class as a module