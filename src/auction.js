const { AUCTION_ADDRESS, ONE_18_ZEROS } = require('../util/constants');

class Auction {

    /**
    * Construct a class that contains properties and methods 
    * related to Axion's Auction contract.
    *
    * @class
    * @constructor
    * @param contract1 - A valid `web3.eth.Contract` object  (layer 1 contract)
    * @param contract2 - A valid `web3.eth.Contract` object (layer 2 contract)
    */ constructor(contract1, contract2) {
        this.contract = contract2;
        this.contract_L1 = contract1;
        this.address = AUCTION_ADDRESS;
    }

    /**
    * Get the reserves of a specific auction.
    * @param {string} id - The ID of the auction to check
    * @returns {Promise<any>} Promise that resolves to the auction reserves of the specified auction. The object has the following properties:
    * @property `eth` - The amount of ETH in the reserve
    * @property `axn` - The amount of AXN in the reserve
    * @property `lastPrice` - The last price from uniswap (per ETH)
    * @property `middlePrice` - The 3-day average price from uniswap (per ETH)
    */ getAuctionReserves(id) {
        if (!id)
            throw new Error("Missing parameter: You must provide the id of the auction.");
        else {
            return new Promise(async (resolve, reject) => {
                try {
                    const reserves = await this.contract.methods.reservesOf(id).call()
                    resolve({
                        eth: reserves.eth / ONE_18_ZEROS,
                        axn: reserves.token / ONE_18_ZEROS,
                        lastPrice: reserves.uniswapLastPrice / ONE_18_ZEROS,
                        middlePrice: reserves.uniswapMiddlePrice / ONE_18_ZEROS,
                    })
                } catch (err) { reject(err) }
            })
        }
    }

    /**
    * Get the id of the current auction.
    * @returns {Promise<string>} Promise that resolves to the current auction ID.
    */ getCurrentAuctionID() {
        return this.contract.methods.calculateStepsFromStart().call();
    }

    /**
    * Get the id of the next weekly auction.
    * @returns {Promise<string>} Promise that resolves to the ID of the next weekly auction.
    */ getNextWeeklyAuctionID() {
        return this.contract.methods.calculateNearestWeeklyAuction().call();
    }

    /**
    * Get the average price for the last 7 days, the current auction bid.
    * @returns {Promise<string>} Promise that resolves to the average price per ETH of Axion.
    */ getCurrentAuctionBid() {
        return this.contract.methods.getUniswapMiddlePriceForSevenDays().call();
    }

    /**
    * Subscribe to auction 'bid' events. Occurs when someone enters the current auction.
    * @returns {Promise<EventEmitter>} Promise that resolves to an EventEmitter object. Standard events such as "data", "changed", "error" and "connected" are available.
    */ subscribeToBidEvents() {
        return this.contract.events.Bid();
    }

    /**
    * Subscribe to auction 'Withdraval' events. Occurs when someone withdraws from an auction.
    * @returns {Promise<EventEmitter>} Promise that resolves to an EventEmitter object. Standard events such as "data", "changed", "error" and "connected" are available.
    */ subscribeToWithdrawEvents() {
        return this.contract.events.Withdraval();
    }

    /**
    * Get Bid events between two blocks.
    * @param {string|number} startBlock - The block to start from
    * @param {string|number} endBlock - The block to end on. Defaults to latest block if omitted.
    * @returns {Promise<EventData[]>} Promise that resolves to an array of the Bid events.
    */ getPastBidEvents(startBlock, endBlock = 'latest') {
        if (!startBlock)
            throw new Error("Missing parameter: You must provide a start block.");
        else {
            return this.contract.getPastEvents("Bid", {
                fromBlock: start,
                toBlock: endBlock
            });
        }
    }

    /**
    * Get Withdraval events between two blocks.
    * @param {number} startBlock - The block to start from
    * @param {number} endBlock - The block to end on. Defaults to latest block if omitted.
    * @returns {Promise<EventData[]>} Promise that resolves to an array of the Bid events.
    */ getPastWithdrawEvents(startBlock, endBlock = 'latest') {
        if (!startBlock)
            throw new Error("Missing parameter: You must provide a start block.");
        else {
            return this.contract.getPastEvents("Withdraval", {
                fromBlock: startBlock,
                toBlock: endBlock
            });
        }
    }

    /**
    * Get the LAYER 2 auction bids of a specific wallet address.
    * @param {string} address - The address to check bids for
    * @returns {Promise<Bid[]>} Promise that resolves to an array of bids.
    * @property `auctionID` - The ID of the auction
    * @property `eth` - The amount of ETH deposited into the auction
    * @property `ref` - The referall address used, or the 0x0 address if no referral.
    * @property `autoStakeDays` - The amount of autostake days chosen
    * @property `withdrawn` - A bool indicating if the bid has been withdrawn
    */ getBidsV2(address) {
        if (!address)
            throw new Error("Missing parameter: You must provide an address.");
        else {
            return new Promise(async (resolve, reject) => {
                try {
                    const auctions = await this.contract.methods.auctionsOf_(address).call();
                    const auctionBidOf = await Promise.all(auctions.map(id => this.contract.methods.auctionBidOf(id, address).call()))
                    const autoStakeDaysOf = await Promise.all(auctions.map(id => this.contract.methods.autoStakeDaysOf(id, address).call()))
                    const bids = auctionBidOf.map((b, idx) => {
                        return {
                            auctionID: +auctions[idx],
                            eth: b.eth / ONE_18_ZEROS,
                            autoStakeDays: +autoStakeDaysOf[idx],
                            ref: b.ref,
                            withdrawn: b.withdrawn,
                        }
                    })
                    resolve(bids);
                } catch (err) { reject(err) }
            })
        }
    }

    /**
    * Get the LAYER 1 auction bids of a specific wallet address.
    * @param {string} address - The address to check bids for
    * @returns {Promise<Bid[]>} Promise that resolves to an array of bids.
    * @property `auctionID` - The ID of the auction
    * @property `eth` - The amount of ETH deposited into the auction
    * @property `ref` - The referall address used, or the 0x0 address if no referral.
    */ getBidsV1(address) {
        if (!address)
            throw new Error("Missing parameter: You must provide an address.");
        else {
            return new Promise(async (resolve, reject) => {
                try {
                    const auctions = await this.contract_L1.methods.auctionsOf_(address).call();
                    const auctionBidOf = await Promise.all(auctions.map(id => this.contract_L1.methods.auctionBetOf(id, address).call()))
                    const bids = auctionBidOf.map((b, idx) => {
                        return {
                            auctionID: +auctions[idx],
                            eth: b.eth / ONE_18_ZEROS,
                            ref: b.ref
                        }
                    })
                    resolve(bids);
                } catch (err) { reject(err) }
            })
        }
    }

    /**
    * Get the combined auction bids (layer 1 + layer 2) of a specific wallet address.
    * Layer 1 stakes withdrawn on layer 1 may show `eth` as zero due to how the contract was created.
    * Layer 1 stakes withdrawn on layer 2 had their info migrated over with the additional properties.
    * @param {string} address - The address to check bids for
    * @returns {Promise<Bid[]>} Promise that resolves to an array of bids.
    * @property `auctionID` - The ID of the auction
    * @property `eth` - The amount of ETH deposited into the auction
    * @property `ref` - The referall address used, or the 0x0 address if no referral.
    * @property `autoStakeDays` - The amount of autostake days chosen (Layer 2 bids only)
    * @property `withdrawn` - A bool indicating if the bid has been withdrawn (Layer 2 bids only)
    */ async getBids(address) {
        const LAYER1_BIDS = await this.getBidsV1(address);
        const LAYER2_BIDS = await this.getBidsV2(address);
        return [...LAYER1_BIDS.filter(l1_bid => LAYER2_BIDS.findIndex(l2_bid => l2_bid.auctionID === l1_bid.auctionID)), ...LAYER2_BIDS]
    }
}

module.exports = Auction;