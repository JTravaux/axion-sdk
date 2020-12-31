const { AUCTION_ADDRESS } = require('../util/constants');

class Auction {
    constructor(contract) {
        this.contract = contract;
        this.address = AUCTION_ADDRESS;
    }

    /**
    * Get the reserves of a specific auction.
    * @param {string} id - The ID of the auction to check
    * @returns {Promise<any>} Promise that resolves to the auction reserves of the specified auction. The structure is as follows:
    * @property `eth` - The amount of ETH in the reserve
    * @property `axn` - The amount of AXN in the reserve
    * @property `lastPrice` - The last price from uniswap (per ETH)
    * @property `middlePrice` - The 7-day average price from uniswap (per ETH)
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
    * @returns {Promise<EventEmitter>} Promise that resolves to an EventEmitter.
    */ subscribeToBidEvents() {
        return this.contract.events.Bid();
    }

    /**
    * Subscribe to auction 'Withdraval' events. Occurs when someone withdraws from an auction.
    * @returns {Promise<EventEmitter>} Promise that resolves to an EventEmitter.
    */ subscribeToWithdrawEvents() {
        return this.contract.events.Withdraval();
    }
}

module.exports = Auction;