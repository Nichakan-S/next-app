import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    return Response.json(await prisma.faculty.findUnique({
      where: {
        id: Number(params.id)
      }
    }))
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'faculty could not be created' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function PUT(req, { params }) {
  try {
    const { facultyName } = await req.json()
    return Response.json(await prisma.faculty.update({
      where: { id: Number(params.id) },
      data: { facultyName },
    }))
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'faculty could not be update' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function DELETE(req, { params }) {
  try {
    return Response.json(await prisma.faculty.delete({
      where: { id: Number(params.id) },
    }))
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'faculty could not be delete' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}