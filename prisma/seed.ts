import { Kotoba, PrismaClient } from '@prisma/client';
import * as csv from 'csv-parser';
import * as fs from 'fs';
import { CreateKotobaDto } from '../src/nihongo/kotoba/dto/create-kotoba.dto';
import { validate } from 'class-validator';

const prisma = new PrismaClient();

const seeding = () => {
  try {
    Promise.all([seedKotoba()])
      .then(() => {
        console.log('Seeding OK');
      })
      .catch(() => {
        console.error('Seeding failed');
      });
  } catch (error) {
    console.error(error);
  }
};

async function seedKotoba() {
  console.log('seeding kotoba');
  const readData = await readFile();
  const data = await validateDataFromCSV(readData);
  return prisma.kotoba
    .createMany({
      data,
      skipDuplicates: true,
    })
    .then((response) => {
      console.log('Seeding kotoba OK');
      console.log(response);
    });
}

async function readFile(): Promise<CreateKotobaDto[]> {
  const results = [];
  const path = 'prisma/kotoba.csv';
  return new Promise((resolve, reject) => {
    fs.createReadStream(path)
      .pipe(csv())
      .on('data', (data: Kotoba) => {
        const item = Object.assign(new CreateKotobaDto(), data);
        results.push(item);
      })
      .on('end', () => {
        resolve(results); // When done, return the results (CSV rows)
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

async function validateDataFromCSV(
  data: CreateKotobaDto[],
): Promise<CreateKotobaDto[]> {
  const errors = [];

  for (const item of data) {
    const checkErrors = await validate(item);

    if (checkErrors.length > 0) {
      errors.push({
        item,
        errors: checkErrors.toString(),
      });
    }

    // If item structure is not valid
    if (Object.keys(item).length > 4) {
      throw new Error('Error seeding');
    }
  }

  if (errors.length > 0) {
    console.error(errors);
    throw new Error('Error validation');
  }

  return data;
}

seeding();
