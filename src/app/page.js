import CardComponents from '@/components/CardComponets'
import Category from '@/components/Category';

export const metadata = {
  title: "Home Page",
  description: "This is the home page",
};

// get data from API
export async function getData() {
  // no-store to avoid cache
  const res = await fetch(
    "https://api.escuelajs.co/api/v1/products?limit=20&offset=0", {cache: "no-store"}
  );
  const data = await res.json();
  return data;
}
export async function getData1(){
  const res1 =  await fetch(
    "https://api.escuelajs.co/api/v1/categories"
  );
  const data1 = await res1.json();
  return data1;
}

export default async function Home() {
  const products = await getData();
  const categories = await getData1();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between m-2 px-5 py-5 scroll-smooth">
      {categories.map((category) =>
          <Category
            key={category.id}
            id={category.id}
            image={category.image}
            name={category.name}
          />
        )}
      </div>
      <main className="flex min-h-screen flex-wrap items-center justify-between p-20">
      {products.map((product) => (
          <CardComponents
            key={product.id}
            id={product.id}
            title={product.title}
            price={product.price}
            image={product.images[0]}
          />
        ))}
    </main>
    </div>
  );
}
