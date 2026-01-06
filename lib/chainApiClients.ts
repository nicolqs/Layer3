/**
 * Chain API Clients - Following SOLID Principles
 *
 * Single Responsibility: Each client handles one chain's API
 * Open/Closed: Easy to add new chains without modifying existing code
 * Liskov Substitution: All clients implement the same interface
 * Interface Segregation: Clean, focused interface
 * Dependency Inversion: Depend on abstractions (IChainApiClient)
 */

import { EtherscanTransaction } from "./types";

// ============================================================================
// Interface (Abstraction) - Dependency Inversion Principle
// ============================================================================

export interface IChainApiClient {
  /**
   * Fetch transactions for an address on this chain
   */
  fetchTransactions(
    address: string,
    page: number,
    limit: number
  ): Promise<EtherscanTransaction[]>;

  /**
   * Get the chain name
   */
  getChainName(): string;

  /**
   * Get the chain ID
   */
  getChainId(): number;
}

// ============================================================================
// Base Abstract Class - Template Method Pattern
// ============================================================================

abstract class BaseEtherscanClient implements IChainApiClient {
  protected abstract chainId: number;
  protected abstract chainName: string;

  async fetchTransactions(
    address: string,
    page: number = 1,
    limit: number = 100
  ): Promise<EtherscanTransaction[]> {
    try {
      const url = this.buildUrl(address, page, limit);
      const response = await fetch(url);

      // Validate response
      if (!this.isValidJsonResponse(response)) {
        console.error(`[${this.chainName}] Invalid response content-type`);
        return [];
      }

      const data = await response.json();

      // Check for API errors
      if (this.isErrorResponse(data)) {
        console.error(
          `[${this.chainName}] API Error:`,
          data.message || data.result
        );
        return [];
      }

      return this.transformResponse(data);
    } catch (error) {
      console.error(`[${this.chainName}] Fetch error:`, error);
      return [];
    }
  }

  getChainName(): string {
    return this.chainName;
  }

  getChainId(): number {
    return this.chainId;
  }

  // ============================================================================
  // Protected Methods - Template Method Pattern
  // ============================================================================

  protected buildUrl(address: string, page: number, limit: number): string {
    const apiKey = this.getApiKey();
    const params = new URLSearchParams({
      chainid: this.chainId.toString(),
      module: "account",
      action: "txlist",
      address: address,
      page: page.toString(),
      offset: limit.toString(),
      sort: "desc",
      apikey: apiKey,
    });

    console.log(
      "params",
      `https://api.etherscan.io/v2/api?${params.toString()}`
    );
    return `https://api.etherscan.io/v2/api?${params.toString()}`;
  }

  /**
   * Get API key from environment
   * All Etherscan-family APIs use the same key
   */
  protected getApiKey(): string {
    return process.env.ETHERSCAN_API_KEY || "";
  }

  protected isValidJsonResponse(response: Response): boolean {
    const contentType = response.headers.get("content-type");
    return contentType ? contentType.includes("application/json") : false;
  }

  protected isErrorResponse(data: unknown): boolean {
    const apiResponse = data as { status?: string; result?: unknown };
    return apiResponse.status === "0" || !Array.isArray(apiResponse.result);
  }

  protected transformResponse(data: unknown): EtherscanTransaction[] {
    const apiResponse = data as { result?: EtherscanTransaction[] };
    return apiResponse.result || [];
  }
}

// ============================================================================
// Concrete Implementations - Single Responsibility Principle
// ============================================================================

/**
 * Ethereum Mainnet API Client
 * All chains use Etherscan V2 API with chainid parameter
 * Docs: https://docs.etherscan.io/v/etherscan-v2/
 */
export class EthereumApiClient extends BaseEtherscanClient {
  protected chainId = 1;
  protected chainName = "Ethereum";
}

/**
 * Arbitrum API Client
 * Docs: https://docs.arbiscan.io/
 */
export class ArbitrumApiClient extends BaseEtherscanClient {
  protected chainId = 42161;
  protected chainName = "Arbitrum";
}

/**
 * Optimism API Client
 * Docs: https://docs.optimism.etherscan.io/
 */
export class OptimismApiClient extends BaseEtherscanClient {
  protected chainId = 10;
  protected chainName = "Optimism";
}

/**
 * Base API Client
 * Docs: https://docs.basescan.org/
 */
export class BaseApiClient extends BaseEtherscanClient {
  protected chainId = 8453;
  protected chainName = "Base";
}

/**
 * Polygon API Client
 * Docs: https://docs.polygonscan.com/
 */
export class PolygonApiClient extends BaseEtherscanClient {
  protected chainId = 137;
  protected chainName = "Polygon";
}

/**
 * Avalanche C-Chain API Client
 * Docs: https://docs.snowtrace.io/
 */
export class AvalancheApiClient extends BaseEtherscanClient {
  protected chainId = 43114;
  protected chainName = "Avalanche";
}

/**
 * BNB Smart Chain API Client
 * Docs: https://docs.bscscan.com/
 */
export class BNBApiClient extends BaseEtherscanClient {
  protected chainId = 56;
  protected chainName = "BNB Chain";
}

/**
 * Gnosis API Client
 * Docs: https://docs.gnosisscan.io/
 */
export class GnosisApiClient extends BaseEtherscanClient {
  protected chainId = 100;
  protected chainName = "Gnosis";
}

/**
 * Celo API Client
 * Docs: https://docs.celoscan.io/
 */
export class CeloApiClient extends BaseEtherscanClient {
  protected chainId = 42220;
  protected chainName = "Celo";
}

/**
 * Moonbeam API Client
 * Docs: https://docs.moonscan.io/
 */
export class MoonbeamApiClient extends BaseEtherscanClient {
  protected chainId = 1284;
  protected chainName = "Moonbeam";
}

/**
 * Mantle API Client
 * Docs: https://docs.mantlescan.xyz/
 */
export class MantleApiClient extends BaseEtherscanClient {
  protected chainId = 5000;
  protected chainName = "Mantle";
}

/**
 * Linea API Client
 * Docs: https://docs.lineascan.build/
 */
export class LineaApiClient extends BaseEtherscanClient {
  protected chainId = 59144;
  protected chainName = "Linea";
}

/**
 * Scroll API Client
 * Docs: https://docs.scrollscan.com/
 */
export class ScrollApiClient extends BaseEtherscanClient {
  protected chainId = 534352;
  protected chainName = "Scroll";
}

/**
 * zkSync API Client
 * Docs: https://docs.zksync.io/
 */
export class zkSyncApiClient extends BaseEtherscanClient {
  protected chainId = 324;
  protected chainName = "zkSync Era";
}

/**
 * XDC API Client
 * Docs: https://xdcscan.io/
 */
export class XDCApiClient extends BaseEtherscanClient {
  protected chainId = 50;
  protected chainName = "XDC Network";
}

// ============================================================================
// Factory - Open/Closed Principle
// ============================================================================

/**
 * Factory to create the appropriate API client for a chain
 * Following Open/Closed Principle: Open for extension, closed for modification
 */
export class ChainApiClientFactory {
  private static clients: Map<number, IChainApiClient> = new Map<
    number,
    IChainApiClient
  >([
    [1, new EthereumApiClient()],
    [10, new OptimismApiClient()],
    [56, new BNBApiClient()],
    [100, new GnosisApiClient()],
    [137, new PolygonApiClient()],
    [324, new zkSyncApiClient()],
    [1284, new MoonbeamApiClient()],
    [5000, new MantleApiClient()],
    [8453, new BaseApiClient()],
    [42161, new ArbitrumApiClient()],
    [42220, new CeloApiClient()],
    [43114, new AvalancheApiClient()],
    [50, new XDCApiClient()],
    [59144, new LineaApiClient()],
    [534352, new ScrollApiClient()],
  ]);

  /**
   * Get API client for a specific chain
   */
  static getClient(chainId: number): IChainApiClient | null {
    return this.clients.get(chainId) || null;
  }

  /**
   * Get all available chain IDs
   */
  static getSupportedChainIds(): number[] {
    return Array.from(this.clients.keys());
  }

  /**
   * Get all clients
   */
  static getAllClients(): IChainApiClient[] {
    return Array.from(this.clients.values());
  }

  /**
   * Register a new client (for extensibility)
   */
  static registerClient(chainId: number, client: IChainApiClient): void {
    this.clients.set(chainId, client);
  }
}
