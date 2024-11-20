let cars = [
    { id: 1, name: "Toyota Corolla", model: "2023", price: 20000 },
    { id: 2, name: "Honda Civic", model: "2022", price: 22000 },
    { id: 3, name: "Ford Mustang", model: "2021", price: 30000 },
  ];
  
  // GET: Retrieve all cars
  export async function GET(req: Request) {
    return new Response(JSON.stringify(cars), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  
  // POST: Add a new car
  export async function POST(req: Request) {
    try {
      const body = await req.json();
      const newCar = {
        id: cars.length ? cars[cars.length - 1].id + 1 : 1, // Auto-increment ID
        ...body,
      };
  
      cars.push(newCar); // Add new car to the array
  
      return new Response(JSON.stringify(newCar), {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Invalid request body" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  }
  
  // PUT: Update an existing car
  export async function PUT(req: Request) {
    try {
      const body = await req.json();
      const { id, ...updates } = body;
  
      const carIndex = cars.findIndex((car) => car.id === id);
  
      if (carIndex === -1) {
        return new Response(JSON.stringify({ error: "Car not found" }), {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
  
      cars[carIndex] = { ...cars[carIndex], ...updates }; // Update car details
  
      return new Response(JSON.stringify(cars[carIndex]), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Invalid request body" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  }
  
  // DELETE: Remove a car
  export async function DELETE(req: Request) {
    try {
      const url = new URL(req.url);
      const id = Number(url.searchParams.get("id")); // Extract ID from query parameters
  
      const carIndex = cars.findIndex((car) => car.id === id);
  
      if (carIndex === -1) {
        return new Response(JSON.stringify({ error: "Car not found" }), {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
  
      const deletedCar = cars.splice(carIndex, 1); // Remove car from array
  
      return new Response(JSON.stringify(deletedCar[0]), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  }
  