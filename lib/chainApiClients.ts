/**
 * Chain API Clients - Following SOLID Principles
 *
 * Single Responsibility: Each client handles one chain's API
 * Open/Closed: Easy to add new chains without modifying existing code
 * Liskov Substitution: All clients implement the same interface
 * Interface Segregation: Clean, focused interface
 * Dependency Inversion: Depend on abstractions (IChainApiClient)
 */

import { EtherscanTransaction } from './types'

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
    limit: number,
  ): Promise<EtherscanTransaction[]>

  /**
   * Get the chain name
   */
  getChainName(): string

  /**
   * Get the chain ID
   */
  getChainId(): number
}

// ============================================================================
// Base Abstract Class - Template Method Pattern
// ============================================================================

abstract class BaseEtherscanClient implements IChainApiClient {
  protected abstract chainId: number
  protected abstract chainName: string

  async fetchTransactions(
    address: string,
    page: number = 1,
    limit: number = 100,
  ): Promise<EtherscanTransaction[]> {
    try {
      const url = this.buildUrl(address, page, limit)
      const response = await fetch(url)

      // Validate response
      if (!this.isValidJsonResponse(response)) {
        console.error(`[${this.chainName}] Invalid response content-type`)
        return []
      }

      const data = await response.json()

      // Check for API errors
      if (this.isErrorResponse(data)) {
        console.error(
          `[${this.chainName}] API Error:`,
          data.message || data.result,
        )
        return []
      }

      return this.transformResponse(data)
    } catch (error) {
      console.error(`[${this.chainName}] Fetch error:`, error)
      return []
    }
  }

  getChainName(): string {
    return this.chainName
  }

  getChainId(): number {
    return this.chainId
  }

  // ============================================================================
  // Protected Methods - Template Method Pattern
  // ============================================================================

  protected buildUrl(address: string, page: number, limit: number): string {
    const apiKey = this.getApiKey()
    const params = new URLSearchParams({
      chainid: this.chainId.toString(),
      module: 'account',
      action: 'txlist',
      address: address,
      page: page.toString(),
      offset: limit.toString(),
      sort: 'desc',
      apikey: apiKey,
    })

    console.log(
      'params',
      `https://api.etherscan.io/v2/api?${params.toString()}`,
    )
    return `https://api.etherscan.io/v2/api?${params.toString()}`
  }

  /**
   * Get API key from environment
   * All Etherscan-family APIs use the same key
   */
  protected getApiKey(): string {
    return process.env.ETHERSCAN_API_KEY || ''
  }

  protected isValidJsonResponse(response: Response): boolean {
    const contentType = response.headers.get('content-type')
    return contentType ? contentType.includes('application/json') : false
  }

  protected isErrorResponse(data: unknown): boolean {
    const apiResponse = data as { status?: string; result?: unknown }
    return apiResponse.status === '0' || !Array.isArray(apiResponse.result)
  }

  protected transformResponse(data: unknown): EtherscanTransaction[] {
    const apiResponse = data as { result?: EtherscanTransaction[] }
    return apiResponse.result || []
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
  protected chainId = 1
  protected chainName = 'Ethereum'
}

/**
 * Arbitrum API Client
 * Docs: https://docs.arbiscan.io/
 */
export class ArbitrumApiClient extends BaseEtherscanClient {
  protected chainId = 42161
  protected chainName = 'Arbitrum'
}

/**
 * Optimism API Client
 * Docs: https://docs.optimism.etherscan.io/
 */
export class OptimismApiClient extends BaseEtherscanClient {
  protected chainId = 10
  protected chainName = 'Optimism'
}

/**
 * Base API Client
 * Docs: https://docs.basescan.org/
 */
export class BaseApiClient extends BaseEtherscanClient {
  protected chainId = 8453
  protected chainName = 'Base'
}

/**
 * Polygon API Client
 * Docs: https://docs.polygonscan.com/
 */
export class PolygonApiClient extends BaseEtherscanClient {
  protected chainId = 137
  protected chainName = 'Polygon'
}

/**
 * Avalanche C-Chain API Client
 * Docs: https://docs.snowtrace.io/
 */
export class AvalancheApiClient extends BaseEtherscanClient {
  protected chainId = 43114
  protected chainName = 'Avalanche'
}

/**
 * BNB Smart Chain API Client
 * Docs: https://docs.bscscan.com/
 */
export class BNBApiClient extends BaseEtherscanClient {
  protected chainId = 56
  protected chainName = 'BNB Chain'
}

/**
 * Gnosis API Client
 * Docs: https://docs.gnosisscan.io/
 */
export class GnosisApiClient extends BaseEtherscanClient {
  protected chainId = 100
  protected chainName = 'Gnosis'
}

/**
 * Celo API Client
 * Docs: https://docs.celoscan.io/
 */
export class CeloApiClient extends BaseEtherscanClient {
  protected chainId = 42220
  protected chainName = 'Celo'
}

/**
 * Moonbeam API Client
 * Docs: https://docs.moonscan.io/
 */
export class MoonbeamApiClient extends BaseEtherscanClient {
  protected chainId = 1284
  protected chainName = 'Moonbeam'
}

/**
 * Mantle API Client
 * Docs: https://docs.mantlescan.xyz/
 */
export class MantleApiClient extends BaseEtherscanClient {
  protected chainId = 5000
  protected chainName = 'Mantle'
}

/**
 * Linea API Client
 * Docs: https://docs.lineascan.build/
 */
export class LineaApiClient extends BaseEtherscanClient {
  protected chainId = 59144
  protected chainName = 'Linea'
}

/**
 * Scroll API Client
 * Docs: https://docs.scrollscan.com/
 */
export class ScrollApiClient extends BaseEtherscanClient {
  protected chainId = 534352
  protected chainName = 'Scroll'
}

/**
 * zkSync API Client
 * Docs: https://docs.zksync.io/
 */
export class zkSyncApiClient extends BaseEtherscanClient {
  protected chainId = 324
  protected chainName = 'zkSync Era'
}

/**
 * XDC API Client
 * Docs: https://xdcscan.io/
 */
export class XDCApiClient extends BaseEtherscanClient {
  protected chainId = 50
  protected chainName = 'XDC Network'
}

// ========== New L2s ==========

/**
 * Arbitrum Nova API Client
 */
export class ArbitrumNovaApiClient extends BaseEtherscanClient {
  protected chainId = 42170
  protected chainName = 'Arbitrum Nova'
}

/**
 * Blast API Client
 */
export class BlastApiClient extends BaseEtherscanClient {
  protected chainId = 81457
  protected chainName = 'Blast'
}

/**
 * Zora API Client
 */
export class ZoraApiClient extends BaseEtherscanClient {
  protected chainId = 7777777
  protected chainName = 'Zora'
}

/**
 * Taiko API Client
 */
export class TaikoApiClient extends BaseEtherscanClient {
  protected chainId = 167000
  protected chainName = 'Taiko'
}

/**
 * Metis API Client
 */
export class MetisApiClient extends BaseEtherscanClient {
  protected chainId = 1088
  protected chainName = 'Metis'
}

/**
 * Mode API Client
 */
export class ModeApiClient extends BaseEtherscanClient {
  protected chainId = 34443
  protected chainName = 'Mode'
}

/**
 * Redstone API Client
 */
export class RedstoneApiClient extends BaseEtherscanClient {
  protected chainId = 690
  protected chainName = 'Redstone'
}

/**
 * Cyber API Client
 */
export class CyberApiClient extends BaseEtherscanClient {
  protected chainId = 7560
  protected chainName = 'Cyber'
}

/**
 * Fraxtal API Client
 */
export class FraxtalApiClient extends BaseEtherscanClient {
  protected chainId = 252
  protected chainName = 'Fraxtal'
}

/**
 * Kroma API Client
 */
export class KromaApiClient extends BaseEtherscanClient {
  protected chainId = 255
  protected chainName = 'Kroma'
}

// ========== Major L1s / Sidechains ==========

/**
 * Polygon zkEVM API Client
 */
export class PolygonZkEVMApiClient extends BaseEtherscanClient {
  protected chainId = 1101
  protected chainName = 'Polygon zkEVM'
}

/**
 * Fantom API Client
 */
export class FantomApiClient extends BaseEtherscanClient {
  protected chainId = 250
  protected chainName = 'Fantom'
}

/**
 * Moonriver API Client
 */
export class MoonriverApiClient extends BaseEtherscanClient {
  protected chainId = 1285
  protected chainName = 'Moonriver'
}

/**
 * Cronos API Client
 */
export class CronosApiClient extends BaseEtherscanClient {
  protected chainId = 25
  protected chainName = 'Cronos'
}

/**
 * Aurora API Client
 */
export class AuroraApiClient extends BaseEtherscanClient {
  protected chainId = 1313161554
  protected chainName = 'Aurora'
}

// ========== Additional Chains ==========

/**
 * Shibarium API Client
 */
export class ShibariumApiClient extends BaseEtherscanClient {
  protected chainId = 109
  protected chainName = 'Shibarium'
}

/**
 * Ethereum Classic API Client
 */
export class EthereumClassicApiClient extends BaseEtherscanClient {
  protected chainId = 61
  protected chainName = 'Ethereum Classic'
}

/**
 * Rootstock API Client
 */
export class RootstockApiClient extends BaseEtherscanClient {
  protected chainId = 30
  protected chainName = 'Rootstock'
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
    // Ethereum & L2s
    [1, new EthereumApiClient()],
    [10, new OptimismApiClient()],
    [42161, new ArbitrumApiClient()],
    [42170, new ArbitrumNovaApiClient()],
    [8453, new BaseApiClient()],
    [81457, new BlastApiClient()],
    [59144, new LineaApiClient()],
    [7777777, new ZoraApiClient()],
    [534352, new ScrollApiClient()],
    [167000, new TaikoApiClient()],
    [5000, new MantleApiClient()],
    [1088, new MetisApiClient()],
    [34443, new ModeApiClient()],
    [690, new RedstoneApiClient()],
    [7560, new CyberApiClient()],
    [252, new FraxtalApiClient()],
    [255, new KromaApiClient()],

    // Major L1s / Sidechains
    [56, new BNBApiClient()],
    [137, new PolygonApiClient()],
    [1101, new PolygonZkEVMApiClient()],
    [43114, new AvalancheApiClient()],
    [250, new FantomApiClient()],
    [1284, new MoonbeamApiClient()],
    [1285, new MoonriverApiClient()],
    [25, new CronosApiClient()],
    [100, new GnosisApiClient()],
    [42220, new CeloApiClient()],
    [1313161554, new AuroraApiClient()],

    // zk / Emerging
    [324, new zkSyncApiClient()],
    [109, new ShibariumApiClient()],
    [61, new EthereumClassicApiClient()],
    [30, new RootstockApiClient()],
    [50, new XDCApiClient()],
  ])

  /**
   * Get API client for a specific chain
   */
  static getClient(chainId: number): IChainApiClient | null {
    return this.clients.get(chainId) || null
  }

  /**
   * Get all available chain IDs
   */
  static getSupportedChainIds(): number[] {
    return Array.from(this.clients.keys())
  }

  /**
   * Get all clients
   */
  static getAllClients(): IChainApiClient[] {
    return Array.from(this.clients.values())
  }

  /**
   * Register a new client (for extensibility)
   */
  static registerClient(chainId: number, client: IChainApiClient): void {
    this.clients.set(chainId, client)
  }
}
