import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Droplet,
  Thermometer,
  Waves,
  Sun,
  Rat,
  WavesLadder,
} from "lucide-react";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-90 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 mx-1">
          <a href="/" className="text-2xl font-bold text-green-600">
            SensoRice
          </a>
          <nav className="hidden md:flex space-x-4">
            <a href="/#features" className="text-gray-600 hover:text-green-600">
              Features
            </a>
            <a href="/#products" className="text-gray-600 hover:text-green-600">
              Products
            </a>
            <a href="/#about" className="text-gray-600 hover:text-green-600">
              About Us
            </a>
            <a href="/demo" className="text-gray-600 hover:text-green-600">
              Demo
            </a>
          </nav>
          <Button variant="outline" className="hidden md:inline-flex">
            Contact Us
          </Button>
        </div>
      </div>
    </header>
  );
};

export const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-b from-green-50 to-white py-20 md:py-32 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 text-center md:text-left mb-10 md:mb-0"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-green-800 mb-4 leading-tight">
              Smart IoT Solutions for{" "}
              <span className="text-green-600">Paddy Fields</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg">
              Optimize your rice production with cutting-edge sensor technology
              and real-time monitoring
            </p>
            <a
              href="/demo"
              className="bg-green-600 hover:bg-green-700 text-white shadow-lg transform transition hover:scale-105 px-6 py-3 text-lg font-medium rounded-md"
            >
              Try the Demo!
            </a>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:w-1/2"
          >
            <img
              src="/both.png?height=400&width=600"
              alt="Smart Paddy Field"
              width={600}
              height={400}
              className="rounded-lg shadow-2xl"
            />
          </motion.div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export const features = [
  {
    title: "Soil Moisture Monitoring",
    icon: WavesLadder,
    description:
      "Monitor soil moisture levels in real-time to optimize irrigation and prevent water wastage.",
    color: "bg-yellow-900",
  },
  {
    title: "Temperature Monitoring",
    icon: Thermometer,
    description:
      "Track field temperature to maintain the ideal environment for healthy rice growth.",
    color: "bg-red-500",
  },
  {
    title: "Humidity Monitoring",
    icon: Droplet,
    description:
      "Measure humidity levels to proactively address risks like plant diseases and pest infestations.",
    color: "bg-emerald-500",
  },
  {
    title: "Light Intensity Monitoring",
    icon: Sun,
    description:
      "Evaluate light exposure to ensure optimal photosynthesis and growth for rice plants.",
    color: "bg-yellow-500",
  },
  {
    title: "Smart Irrigation System",
    icon: Waves,
    description:
      "Automate and optimize irrigation schedules, saving water and reducing energy consumption.",
    color: "bg-blue-500",
  },
  {
    title: "Pest Detection System",
    icon: Rat,
    description:
      "Leverage AI to detect pests early and implement timely interventions for pest control.",
    color: "bg-lime-950",
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center text-green-800 mb-12"
        >
          Our Features
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className={`${feature.color} rounded-t-lg p-4`}>
                  <feature.icon className="w-12 h-12 text-white mb-2" />
                  <CardTitle className="text-xl font-semibold text-white">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const products = [
  {
    name: "SensoRice Sensor",
    description: "Advanced IoT sensor for comprehensive paddy field monitoring",
    price: "$56.50",
    image: "/sensorice-sensor.png?",
  },
  {
    name: "SensoRice Smart Irrigation Control",
    description:
      "Automated irrigation system for efficient water management (paired with SensoRice Sensor)",
    price: "$31.81",
    image: "/sensorice-irrigation.png?",
  },
];

export const ProductSection = () => {
  return (
    <section id="products" className="py-20 bg-green-50">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center text-green-800 mb-12"
        >
          Our Products
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
            >
              <div className="relative h-78">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-green-800 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-green-600">
                    {product.price}
                  </span>
                  <Button
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <img
              src="/both.png"
              alt="About Sensorice"
              width={600}
              height={400}
              className="rounded-lg shadow-md"
            />
          </div>
          <div className="md:w-1/2 md:pl-12">
            <h2 className="text-3xl font-bold text-green-800 mb-6">
              About Sensorice
            </h2>
            <p className="text-gray-600 mb-4">
              Sensorice is a leading provider of IoT solutions for paddy fields.
              Our mission is to empower farmers with cutting-edge technology to
              optimize their rice production and increase yields.
            </p>
            <p className="text-gray-600 mb-4">
              With years of experience in agricultural technology, we understand
              the unique challenges faced by rice farmers. Our team of experts
              is dedicated to developing innovative solutions that make a real
              difference in the field.
            </p>
            <p className="text-gray-600">
              Join us in revolutionizing paddy field management with smart,
              sustainable, and efficient IoT products.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Footer = () => {
  return (
    <footer className="bg-green-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h3 className="text-2xl font-bold mb-4">Sensorice</h3>
            <p className="text-sm">Smart IoT solutions for paddy fields</p>
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/demo" className="hover:text-green-300">
                  Demo
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-green-300">
                  Features
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-green-300">
                  Products
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-green-300">
                  About Us
                </a>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <p className="text-sm mb-2">Email: alvinyoh08@gmail.com</p>
            {/* <p className="text-sm mb-2">Phone: </p> */}
            <p className="text-sm">
              Address: Tangerang Kota, Banten, Indonesia.
            </p>
          </div>
          <div className="w-full md:w-1/4">
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-green-300">
                Facebook (soon)
              </a>

              <a href="#" className="hover:text-green-300">
                Twitter (soon)
              </a>
              <a
                href="https://linked.in/in/alvinyohanes"
                className="hover:text-green-300"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-green-700 text-center">
          <p className="text-sm">&copy; 2025 SensoRice. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const LandingPage = () => {
  return (
    <>
      <Header />
      <HeroSection />
      <FeaturesSection />
      <ProductSection />
      <AboutSection />
      <Footer />
    </>
  );
};

export default LandingPage;
