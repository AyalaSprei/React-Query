"use client";

import React, { useState } from "react";
import { getAllCars, deleteCar, createCar, updateCar } from '@/app/services/cars';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface carProps {}

const Car: React.FC<carProps> = () => {
  const queryClient = useQueryClient();
  const [isMutating, setIsMutating] = useState(false);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["cars"],
    queryFn: getAllCars,
    staleTime: 10000,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCar,
    onMutate: async (id: string) => {
        setIsMutating(true);
        await queryClient.cancelQueries({ queryKey: ['cars'] })
        const previousCars = queryClient.getQueryData(['cars'])
        queryClient.setQueryData(['cars'], (old: any) => old.filter((car: any) => car._id !== id))
        return { previousCars }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['cars'] }); setIsMutating(false) },
});

const createCarMutation = useMutation({
  mutationFn: createCar,
  onMutate: async (car: any) => {
      setIsMutating(true);
      await queryClient.cancelQueries({ queryKey: ['cars'] })
      const previousCars = queryClient.getQueryData(['cars'])
      queryClient.setQueryData(['cars'], (old: any) => [...old, car])
      return { previousCars }
  },
  onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] }); setIsMutating(false);
  },
})
const updateCarMutation = useMutation({
  mutationFn: ({ id, car }: { id: string, car: any }) => updateCar(id, car),
  onMutate: async ({ id, car }: { id: string, car: any }) => {
      setIsMutating(true);
      await queryClient.cancelQueries({ queryKey: ['cars'] })
      const previousCars = queryClient.getQueryData(['cars'])
      queryClient.setQueryData(['cars'], (old: any) => old.map((oldCar: any) => oldCar._id === id ? car : oldCar))
      return { previousCars }
  },
  onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] }); setIsMutating(false);
  },
})


if (isLoading) return <p>Loading cars...</p>;

  return (
    <div>
      <h1>Car List</h1>
      {isFetching && <p>Refreshing data...</p>}

      <ul>
        {data?.map((car: any) => (
          <li key={car._id}>
            <p><strong>Name:</strong> {car.name}</p>
            <p><strong>Model:</strong> {car.model}</p>
            <p><strong>Price:</strong> ${car.price}</p>
            <button
              onClick={() => deleteMutation.mutate(car._id)}
              disabled={isMutating}
            >
              {isMutating ? "Deleting..." : "Delete"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Car;

