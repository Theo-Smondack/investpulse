import { CoinAcademy, CoinTribune, JournalDuCoin } from '@/lib/classes/news-strategies';
import { INewsExtractionStrategy } from '@/types/classes/NewsExtractionStrategy';

export class NewsExtractionStrategyFactory {
    private strategies: Map<string, new () => INewsExtractionStrategy> = new Map();

    constructor() {
        this.registerStrategy('coinacademy', CoinAcademy);
        this.registerStrategy('journalducoin', JournalDuCoin);
        this.registerStrategy('cointribune', CoinTribune);

    }

    registerStrategy(key: string, strategy: new () => INewsExtractionStrategy) {
        this.strategies.set(key.toLowerCase(), strategy);
    }

    getStrategy(key: string): INewsExtractionStrategy {
        const StrategyClass = this.strategies.get(key.toLowerCase());
        if (!StrategyClass) {
            throw new Error(`No strategy found for: ${key}`);
        }
        return new StrategyClass();
    }
}
