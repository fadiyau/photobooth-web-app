import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Insert frame...");

  await prisma.frame.createMany({
    data: [
      {
        name: "Budi",
        thumbnail: "/frames/budi.png",
        image: "/frames/budi.png",
      },
      {
        name: "Windut",
        thumbnail: "/frames/windut.png",
        image: "/frames/windut.png",
      },
      {
        name: "Zootopia",
        thumbnail: "/frames/zootopia.png",
        image: "/frames/zootopia.png",
      },
    ],
  });

  console.log("Berhasil!");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });