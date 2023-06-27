import { v4 as uuidv4 } from "uuid";
// import { EventService } from '../service/event/event.service';

// const eventExists = async (shortId: string) => {
//   const event = await EventService.getEventByShortId({ shortId });
//   if (event && event.id) {
//     return true
//   }
//   return false;
// }

const generateId = () => {
  const uuidFlat = uuidv4().replace(/-/g, "");
  const idChunks = uuidFlat.match(/.{1,7}/g) as Array<string>;
  return idChunks.reduce((acc, chunk) => {
    const index = Math.floor(Math.random() * 5);
    const char = chunk[index];
    return `${acc}${char ?? ""}`;
  }, "");
};
// export default async function generateEventShortId(): Promise<string> {
//   let shortId = generateId();
//   while (await eventExists(shortId)) {
//     shortId = generateId();
//   }

//   return shortId;
// }
