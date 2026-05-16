const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'prime_motors.db');
const db = new sqlite3.Database(dbPath);

const sampleTrucks = [
  {
    title: '2024 Ford F-150 Lariat',
    description: 'The 2024 Ford F-150 Lariat is a full-size pickup truck that combines power, luxury, and advanced technology. Featuring a robust 3.5L EcoBoost V6 engine with 400 horsepower, this truck offers exceptional towing capacity and fuel efficiency. The interior is crafted with premium materials, including leather seating, a panoramic sunroof, and the latest SYNC 4 infotainment system with a 12-inch touchscreen. Perfect for both work and recreation.',
    category_id: 1,
    brand: 'Ford',
    model: 'F-150',
    year: 2024,
    price: 58990,
    condition: 'New',
    mileage: 0,
    engine: '3.5L EcoBoost V6',
    transmission: '10-Speed Automatic',
    fuel_type: 'Gasoline',
    color: 'Blue',
    vin: '1FTEW1EP5RKF12345',
    images: JSON.stringify([]),
    is_featured: 1,
    is_available: 1
  },
  {
    title: '2023 Chevrolet Silverado 2500HD LT',
    description: 'The 2023 Chevrolet Silverado 2500HD LT is a heavy-duty pickup truck built for serious work. Powered by a Duramax 6.6L Turbo-Diesel V8 engine delivering 445 horsepower and 910 lb-ft of torque, this truck offers a maximum towing capacity of 22,500 pounds. The LT trim includes a comfortable interior with cloth seats, an 8-inch touchscreen, and Chevrolet Infotainment 3 system. Ideal for construction, agriculture, and heavy hauling.',
    category_id: 1,
    brand: 'Chevrolet',
    model: 'Silverado 2500HD',
    year: 2023,
    price: 52450,
    condition: 'New',
    mileage: 0,
    engine: '6.6L Duramax Turbo-Diesel V8',
    transmission: '10-Speed Automatic',
    fuel_type: 'Diesel',
    color: 'Black',
    vin: '3GCUYGED4LG567890',
    images: JSON.stringify([]),
    is_featured: 1,
    is_available: 1
  },
  {
    title: '2022 RAM 1500 Limited',
    description: 'The 2022 RAM 1500 Limited is a premium full-size pickup truck that redefines luxury in the truck segment. Equipped with a 5.7L HEMI V8 engine with eTorque mild hybrid technology, it delivers 395 horsepower and excellent fuel economy. The Limited trim features a stunning interior with premium leather seating, real wood accents, a 12-inch touchscreen with Uconnect 5, and a 19-speaker Harman Kardon audio system. Perfect for those who demand the best.',
    category_id: 1,
    brand: 'RAM',
    model: '1500',
    year: 2022,
    price: 62890,
    condition: 'Used',
    mileage: 15000,
    engine: '5.7L HEMI V8 with eTorque',
    transmission: '8-Speed Automatic',
    fuel_type: 'Gasoline',
    color: 'Silver',
    vin: '1C6SRFLT4MN111222',
    images: JSON.stringify([]),
    is_featured: 1,
    is_available: 1
  }
];

async function addSampleTrucks() {
  try {
    await new Promise((resolve, reject) => {
      db.serialize(() => {
        const stmt = db.prepare(`
          INSERT INTO trucks (
            title, description, category_id, brand, model, year, price,
            condition, mileage, engine, transmission, fuel_type, color, vin,
            images, is_featured, is_available
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        sampleTrucks.forEach(truck => {
          stmt.run(
            truck.title, truck.description, truck.category_id, truck.brand,
            truck.model, truck.year, truck.price, truck.condition,
            truck.mileage, truck.engine, truck.transmission, truck.fuel_type,
            truck.color, truck.vin, truck.images, truck.is_featured,
            truck.is_available,
            function(err) {
              if (err) {
                console.error('Error inserting truck:', err);
              } else {
                console.log(`Added truck: ${truck.title}`);
              }
            }
          );
        });

        stmt.finalize((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    });

    console.log('Successfully added 3 sample trucks to the database');
    db.close();
  } catch (error) {
    console.error('Error adding sample trucks:', error);
    db.close();
    process.exit(1);
  }
}

addSampleTrucks();
