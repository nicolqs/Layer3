import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { CHAIN_EXPLORERS } from '@/lib/chains'
import { AlchemyNFT } from '@/lib/types'
import Image from 'next/image'

interface NFTsTabProps {
  nfts?: AlchemyNFT[]
  isLoading: boolean
}

export function NFTsTab({ nfts, isLoading }: NFTsTabProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg">NFT Collection</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            NFTs owned across all chains
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          {isLoading ? (
            <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-48 sm:h-64 w-full" />
              ))}
            </div>
          ) : nfts && nfts.length > 0 ? (
            <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {nfts.map((nft) => {
                const imageUrl =
                  nft.image?.cachedUrl ||
                  nft.image?.thumbnailUrl ||
                  nft.image?.pngUrl ||
                  nft.raw?.metadata?.image ||
                  ''
                const nftName =
                  nft.name || nft.raw?.metadata?.name || `Token #${nft.tokenId}`
                const collectionName =
                  nft.collection?.name || nft.contract?.name || 'Unknown'

                // NFTs are fetched from Ethereum mainnet (chainId: 1)
                const chainId = 1
                const chainConfig = CHAIN_EXPLORERS[chainId]

                return (
                  <Card
                    key={`${nft.contract.address}-${nft.tokenId}`}
                    className="overflow-hidden group hover:shadow-lg transition-shadow"
                  >
                    <div className="relative aspect-square bg-muted">
                      {imageUrl ? (
                        <img
                          loading="lazy"
                          src={imageUrl}
                          alt={nftName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${nft.contract.address}-${nft.tokenId}`
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                          No Image
                        </div>
                      )}

                      {/* Chain badge overlay */}
                      <div className="absolute top-2 right-2">
                        <Badge
                          variant="secondary"
                          className="flex items-center p-1 bg-background/90 backdrop-blur-sm border-border/50 shadow-lg"
                        >
                          <Image
                            src={chainConfig.logo}
                            alt={chainConfig.name}
                            width={16}
                            height={16}
                            className="flex-shrink-0"
                          />
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="p-3 sm:p-4">
                      <CardTitle className="text-xs sm:text-sm truncate">
                        {nftName}
                      </CardTitle>
                      <CardDescription className="text-[10px] sm:text-xs truncate">
                        {collectionName}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No NFTs found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
