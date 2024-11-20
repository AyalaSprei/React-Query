import { connectDatabase, getAllDocuments, insertDocument, updateDocument } from "@/app/services/mongo";
import { NextResponse } from "next/server";



  export async function GET() {
    try {
      const client = await connectDatabase();
      const recipes = await getAllDocuments(client, 'Cars');
      await client.close();
      console.log(recipes)
      return NextResponse.json(recipes);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      return NextResponse.error();
    }
  }

  export async function POST(req: Request) {
    try {
      const client = await connectDatabase();
      const newRecipe = await req.json();
      const result = await insertDocument(client, 'Cars', newRecipe);
      await client.close();
      // Return the newly added recipe as a response
      return NextResponse.json(result, { status: 201 }); // 201 Created status
    } catch (error) {
      console.error("Error adding recipe:", error);
      return NextResponse.error();
    }
  }

  export async function PATCH(request: Request) {
    const body = await request.json();
    const client = await connectDatabase();
    const update = {name: body.name, model: body.model, price: body.price };
    const result = await updateDocument(client, 'Cars', body._id, update);
    return NextResponse.json(result);
}
