import StoryInnovation from '@/components/about/StoryInnovation'
import ConnectWithExperts from '@/components/home/ConnectWithExperts'
import LatestBlogs from '@/components/home/LatestBlogs'
import Testimonials from '@/components/home/Testimonials'
import OurAcousticPanels from '@/components/products/OurAcousticPanels'
import ProductContentSection from '@/components/products/ProductContentSection'
import ProductHeroSection from '@/components/products/ProductHeroSection'
import WhyChooseSection from '@/components/products/WhyChooseSection'
import { fetchMergedProduct } from '@/lib/products-data'
import { notFound } from 'next/navigation'

type Props = { params: Promise<{ category: string; subcategory: string }> }

export default async function SubcategoryPage({ params }: Props) {
  const { category, subcategory } = await params
  const product = await fetchMergedProduct(subcategory)

  if (!product) notFound()

  return (
    <>
      <ProductHeroSection
        title={product.title}
        description={product.description}
        heroImage={product.heroImage}
        breadcrumbText={product.title}
      />
      <ProductContentSection
        title={product.title}
        description={product.description}
      />
      <OurAcousticPanels productSlug={product.slug} categorySlug={category} />
      <WhyChooseSection
        title={product.title}
        description={product.description}
      />
      <StoryInnovation/>
      <LatestBlogs/>
      <Testimonials/>
      <ConnectWithExperts/>
    </>
  )
}
