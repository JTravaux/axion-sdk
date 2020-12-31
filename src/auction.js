const { AUCTION_ADDRESS } = require('../util/constants');

class Auction {
    constructor(contract) {
        this.contract = contract;
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
            return new Promise((resolve, reject) => {
                this.contract.methods.reservesOf(id).call()
                    .then(reserves => {
                        resolve({
                            eth: reserves.eth,
                            axn: reserves.token,
                            lastPrice: reserves.uniswapLastPrice,
                            middlePrice: reserves.uniswapMiddlePrice,
                        })
                    })
                    .catch(err => reject(err))
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
    * @param {string|number} start - The block to start from
    * @param {string|number} end - The block to end on. Defaults to latest block if omitted.
    * @returns {Promise<EventData[]>} Promise that resolves to an array of the Bid events.
    */ getPastBidEvents(start, end = 'latest') {
        if (!start)
            throw new Error("Missing parameter: You must provide a start block.");
        else {
            return this.contract.getPastEvents("Bid", {
                fromBlock: start,
                toBlock: end
            });
        }
    }

    /**
    * Get Withdraval events between two blocks.
    * @param {string|number} start - The block to start from
    * @param {string|number} end - The block to end on. Defaults to latest block if omitted.
    * @returns {Promise<EventData[]>} Promise that resolves to an array of the Bid events.
    */ getPastWithdrawEvents(start, end = 'latest') {
        if (!start)
            throw new Error("Missing parameter: You must provide a start block.");
        else {
            return this.contract.getPastEvents("Withdraval", {
                fromBlock: start,
                toBlock: end
            });
        }
    }
}

module.exports = Auction;