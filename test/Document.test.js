const Document = artifacts.require("Document");

require('chai')
	.use(require('chai-as-promised'))
	.should()

contract('Document', (accounts) => {
	let doc

	before(async () => {
		doc = await Document.deployed()
	})

	describe('deployment', async () =>{

		it('deploys successfully', async () =>{
			const address = doc.address;
			//console.log(address)
			assert.notEqual(address, '')
			assert.notEqual(address, null)
			assert.notEqual(address, undefined)
			assert.notEqual(address, 0x0)
		})
	})

	describe('storage', async () =>{
		it('updates the HashValue', async () => {
			let hashValue
			hashValue = 'aaa123'
			await doc.set(hashValue)
			const res = await doc.get()
			assert.equal(hashValue, res)
		})
	})
})