import { useGetCombos } from "@workspace/api-client-react";
import { Link, useLocation } from "wouter";
import { ShoppingBag, Star, ShieldCheck, Leaf } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { data: combos, isLoading, error } = useGetCombos();
  const [, navigate] = useLocation();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
            alt="Henna Pattern Background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-accent/20 text-primary text-sm font-semibold tracking-wider uppercase mb-6 border border-accent/30">
              Premium Organic Henna
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground leading-[1.1] mb-6">
              The Art of Henna, <br/><span className="text-primary italic">Delivered.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-lg">
              Experience the darkest, longest-lasting stain with our handcrafted, 100% natural organic henna and nail colors.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => {
                  document.getElementById('combos')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 rounded-xl font-semibold bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
              >
                <ShoppingBag size={20} />
                Shop Combos
              </button>
            </div>
            
            <div className="mt-12 flex gap-8">
              <div className="flex items-center gap-2">
                <Leaf className="text-accent" size={24} />
                <span className="text-sm font-medium text-foreground">100% Organic</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-accent" size={24} />
                <span className="text-sm font-medium text-foreground">Chemical Free</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="text-accent" size={24} fill="currentColor" />
                <span className="text-sm font-medium text-foreground">Premium Quality</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Combos Section */}
      <section id="combos" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-foreground mb-4">Our Special Combos</h2>
            <div className="w-24 h-1 bg-accent mx-auto rounded-full mb-6"></div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose from our carefully curated combinations of henna and nail cones. The perfect package for your next event or celebration.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="animate-pulse bg-card rounded-3xl h-[400px] border border-border/50"></div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-destructive/10 rounded-2xl border border-destructive/20 text-destructive">
              <p>Failed to load combos. Please try again later.</p>
            </div>
          ) : combos?.length === 0 ? (
             <div className="text-center py-12 text-muted-foreground">
               No combos available right now.
             </div>
          ) : (
            <motion.div 
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {combos?.map((combo) => (
                <motion.div 
                  key={combo.id}
                  variants={item}
                  className="group bg-card rounded-3xl overflow-hidden border border-border/60 shadow-md hover:shadow-2xl hover:border-primary/30 transition-all duration-500 flex flex-col"
                >
                  <div className="aspect-[4/3] relative overflow-hidden bg-secondary/30 p-6 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
                    {/* Abstract combo illustration / placeholder */}
                    <img 
                      src={`${import.meta.env.BASE_URL}images/henna-placeholder.png`}
                      alt={combo.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full font-bold text-primary shadow-sm">
                      ₹{combo.price}
                    </div>
                  </div>
                  
                  <div className="p-8 flex flex-col flex-grow">
                    <h3 className="text-2xl font-display font-bold text-foreground mb-4">{combo.name}</h3>
                    
                    <div className="space-y-3 mb-8 flex-grow">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <div className="w-2 h-2 rounded-full bg-accent"></div>
                        <span>{combo.hennaCount} Organic Henna Cone{combo.hennaCount > 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <div className="w-2 h-2 rounded-full bg-[#8b3d3d]"></div>
                        <span>{combo.nailCount} Premium Nail Cone{combo.nailCount > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => navigate(`/checkout?comboId=${combo.id}`)}
                      className="w-full py-4 rounded-xl font-semibold henna-gradient text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                      Checkout Now
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
