"use client";

import React, { useState } from "react";
import {
  getAllCars,
  deleteCar,
  createCar,
  updateCar,
} from "@/app/services/cars";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
interface carProps {}

const Car: React.FC<carProps> = () => {
  const queryClient = useQueryClient();
  const [isMutating, setIsMutating] = useState(false);
  const [newCar, setNewCar] = useState({ name: "", model: "", price: "" });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["cars"],
    queryFn: getAllCars,
    staleTime: 10000,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCar,
    onMutate: async (_id: string) => {
      setIsMutating(true);
      await queryClient.cancelQueries({ queryKey: ["cars"] });
      const previousCars = queryClient.getQueryData(["cars"]);
      queryClient.setQueryData(["cars"], (old: any) =>
        old.filter((car: any) => car._id !== _id)
      );
      return { previousCars };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      setIsMutating(false);
    },
  });

  const createCarMutation = useMutation({
    mutationFn: createCar,
    onMutate: async (car: any) => {
      setIsMutating(true);
      await queryClient.cancelQueries({ queryKey: ["cars"] });
      const previousCars = queryClient.getQueryData(["cars"]);
      queryClient.setQueryData(["cars"], (old: any) => [...old, car]);
      return { previousCars };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      setIsMutating(false);
    },
  });

  const updateCarMutation = useMutation({
    mutationFn: ({ _id, car }: { _id: string; car: any }) =>
      updateCar(_id, car),
    onMutate: async ({ _id, car }: { _id: string; car: any }) => {
      setIsMutating(true);
      await queryClient.cancelQueries({ queryKey: ["cars"] });
      const previousCars = queryClient.getQueryData(["cars"]);
      queryClient.setQueryData(["cars"], (old: any) =>
        old.map((oldCar: any) => (oldCar._id === _id ? car : oldCar))
      );
      return { previousCars };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      setIsMutating(false);
    },
  });

  const handleCreateCar = () => {
    createCarMutation.mutate(newCar);
    setNewCar({ name: "", model: "", price: "" });
  };

  const handleUpdateCar = (_id: string, updatedCar: any) => {
    updateCarMutation.mutate({ _id, car: updatedCar });
  };

  if (isLoading) return <p>Loading cars...</p>;

  return (
    <div className="car-container">
      <header className="header">
        <h1>Car Management</h1>
      </header>

      <div className="add-car-form">
        <h2>Add New Car</h2>
        <input
          type="text"
          placeholder="Name"
          value={newCar.name}
          onChange={(e) => setNewCar({ ...newCar, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Model"
          value={newCar.model}
          onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={newCar.price}
          onChange={(e) => setNewCar({ ...newCar, price: e.target.value })}
        />
        <button onClick={handleCreateCar} disabled={isMutating}>
          {isMutating ? "Adding..." : "Add Car"}
        </button>
      </div>

      <h2>Existing Cars</h2>
      {isFetching && <p>Refreshing data...</p>}
      <ul className="car-list">
        {data?.map((car: any) => (
          <li key={car._id} className="car-card">
            <div>
              <label>
                <strong>Name:</strong>
                <input
                  type="text"
                  value={car.name}
                  onChange={(e) =>
                    handleUpdateCar(car._id, { ...car, name: e.target.value })
                  }
                />
              </label>
            </div>
            <div>
              <label>
                <strong>Model:</strong>
                <input
                  type="text"
                  value={car.model}
                  onChange={(e) =>
                    handleUpdateCar(car._id, { ...car, model: e.target.value })
                  }
                />
              </label>
            </div>
            <div>
              <label>
                <strong>Price:</strong>
                <input
                  type="number"
                  value={car.price}
                  onChange={(e) =>
                    handleUpdateCar(car._id, {
                      ...car,
                      price: parseFloat(e.target.value),
                    })
                  }
                />
              </label>
            </div>
            <div>
              <button
                onClick={() => deleteMutation.mutate(car._id)}
                disabled={isMutating}
                className="delete-btn"
              >
                {isMutating ? "Deleting..." : "Delete"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Car;
