import ConnectWithExperts from '@/components/home/ConnectWithExperts'
import Testimonials from '@/components/home/Testimonials'
import AboutProduct from '@/components/products/AboutProduct'
import CertificationsSection from '@/components/products/CertificationsSection'
import FinishesShades from '@/components/products/FinishesShades'
import GallerySection from '@/components/products/GallerySection'
import Product3DViewer from '@/components/products/Product3DViewer'
import LinearluxGrid from '@/components/products/LinearluxGrid'
import LinearluxHero from '@/components/products/LinearluxHero'
import ProductSpecification from '@/components/products/ProductSpecification'
import RelatedProducts from '@/components/products/RelatedProducts'
import SubstratesSection from '@/components/products/SubstratesSection'
import { fetchMergedSubProduct } from '@/lib/products-data'
import { notFound } from 'next/navigation'

type Props = { params: Promise<{ category: string; subcategory: string; product: string }> }

export default async function ProductDetailPage({ params }: Props) {
  const { subcategory, product: productSlug } = await params
  const { product, subProduct } = await fetchMergedSubProduct(subcategory, productSlug)

  if (!product || !subProduct) notFound()

  return (
    <>
      <LinearluxHero
        productTitle={product.title}
        subProductTitle={subProduct.title}
        description={subProduct.description}
      />
      <LinearluxGrid/>
      <ProductSpecification/>
      <GallerySection/>
      <Product3DViewer/>
      <SubstratesSection/>
      <AboutProduct/>
      <CertificationsSection/>
      <FinishesShades/>
      <Testimonials/>
      <RelatedProducts/>
      <ConnectWithExperts/>
    </>
  )
}
