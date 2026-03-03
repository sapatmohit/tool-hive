import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "src/data");

export async function readData<T>(collection: string): Promise<T[]> {
    try {
        const filePath = path.join(DATA_DIR, `${collection}.json`);
        const content = await fs.readFile(filePath, "utf-8");
        return JSON.parse(content);
    } catch (error) {
        console.error(`Error reading ${collection}:`, error);
        return [];
    }
}

export async function writeData<T>(collection: string, data: T[]): Promise<void> {
    try {
        const filePath = path.join(DATA_DIR, `${collection}.json`);
        await fs.writeFile(filePath, JSON.stringify(data, null, 4), "utf-8");
    } catch (error) {
        console.error(`Error writing ${collection}:`, error);
        throw new Error(`Failed to write to ${collection}`);
    }
}

export async function getItemById<T extends { id: string }>(collection: string, id: string): Promise<T | null> {
    const data = await readData<T>(collection);
    return data.find((item) => item.id === id) || null;
}

export async function addItem<T extends { id: string }>(collection: string, item: T): Promise<T> {
    const data = await readData<T>(collection);
    data.push(item);
    await writeData(collection, data);
    return item;
}

export async function updateItem<T extends { id: string }>(
    collection: string,
    id: string,
    updates: Partial<T>
): Promise<T | null> {
    const data = await readData<T>(collection);
    const index = data.findIndex((item) => item.id === id);
    if (index === -1) return null;

    data[index] = { ...data[index], ...updates };
    await writeData(collection, data);
    return data[index];
}

export async function deleteItem(collection: string, id: string): Promise<boolean> {
    const data = await readData<{ id: string }>(collection);
    const filtered = data.filter((item) => item.id !== id);
    if (filtered.length === data.length) return false;

    await writeData(collection, filtered);
    return true;
}
