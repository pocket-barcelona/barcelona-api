import { statSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import * as path from 'node:path';
import * as sharp from 'sharp';

type ExportImageSettings = {
	width: number;
	height: number;
	inputFile: string;
	outputFilePath: string;
	outputFileName: string;
};

// if error: Error: Could not load the "sharp" module using the darwin-x64 runtime
// make sure optional dependencies are installed: yarn add sharp --ignore-engines

/**
 * Our files on local disk are like this:
 *
 * LOCAL Source structure:
 *
 * /VOLUMES/DAZZLE_FILES/BCN Website Photos/Barcelona_Barrios_And_Places/Places/*
 * 1_badalona_beach
 *   _poster.jpg
 *   IMG_0669.JPG
 *   IMG_0673.MOV
 *   etc...
 * 2_barceloneta_market
 * 3_arc_de_triomf
 *
 * ---
 *
 * LOCAL Destination structure:
 *
 * /VOLUMES/DAZZLE_FILES/BCN Website Photos/Barcelona_Barrios_And_Places/PlacesConverted/*
 * thumb/1_poster.avif
 * small/1_poster.avif
 * medium/1_poster.avif
 * large/1_poster.avif
 * xlarge/1_poster.avif
 *
 * ---
 *
 * REMOTE (AWS) Destination structure:
 *
 * /Amazon S3/Buckets/barcelonasite/images/places/_posters/*
 * thumb/1_poster.avif
 * small/1_poster.avif
 * medium/1_poster.avif
 * large/1_poster.avif
 * xlarge/1_poster.avif
 *
 * ---
 * Image Dimensions:
 * - Thumb: 64 x 64 px
 * - Small: 128 x 128 px
 * - Medium: 400 x 400 px
 * - Large: 720 x 720 px
 * - XLarge: 1200 x 1200 px
 */

// if true, no processing will happen, only console logging
const DRY_RUN = false;
// the list of files to be processed - for logging only
const DRY_RUN_FILE_LIST: { in: string; out: string }[] = [];
const ignoreFiles = ['.DS_Store'];
// const srcFolder = "./../Pictures/PocketBarcelona/app_images_dont_rename/";
const SOURCE_FOLDER =
	'/Volumes/DAZZLE_FILES/BCN Website Photos/Barcelona_Barrios_And_Places/Places/';
const DESTINATION_FOLDER =
	'/Volumes/DAZZLE_FILES/BCN Website Photos/Barcelona_Barrios_And_Places/PlacesConverted/';

const SKIPPED_FOLDERS: string[] = []; // folders which don't have a _poster.jpg in them
const RESIZE_FOLDERS = [
	{
		name: 'thumb',
		width: 64,
		height: 64,
	},
	{
		name: 'small',
		width: 128,
		height: 128,
	},
	{
		name: 'medium',
		width: 400,
		height: 400,
	},
	{
		name: 'large',
		width: 720,
		height: 720,
	},
	// {
	//   name: "xlarge",
	//   width: 1200,
	//   height: 1200
	// }
] as const;

if (DRY_RUN) {
	console.warn('DRY RUN. Will process the following files:');
}

const folders = await readdir(SOURCE_FOLDER);

for (const folder of folders) {
	if (ignoreFiles.indexOf(folder) > -1) {
		continue;
	}
	const name = path.join(SOURCE_FOLDER, folder);
	if (statSync(name).isDirectory()) {
		processFolder(folder);
		// break; // do only 1!
	}
}

if (DRY_RUN_FILE_LIST.length > 0) {
	console.warn(`DRY RUN: ${DRY_RUN_FILE_LIST.map((f) => `In: ${f.in}. Out: ${f.out}`).join('\n')}`);
	console.warn(`DRY RUN TOTAL: ${DRY_RUN_FILE_LIST.length} files`);
	console.log('--------------------------------------');
}
if (SKIPPED_FOLDERS.length > 0) {
	console.warn(`Skipped folders: ${SKIPPED_FOLDERS.join('\n')}`);
	console.warn(`Skipped folders total: ${SKIPPED_FOLDERS.length} folders`);
}

async function processFolder(folderName: string) {
	const srcFolderName = path.join(SOURCE_FOLDER, folderName);
	if (!statSync(srcFolderName).isDirectory()) {
		return;
	}

	// 1. go in this folder
	// 2. find _poster.jpg
	// 3. output 1_poster.avif
	const file = path.join(srcFolderName, '_poster.jpg');
	let posterExists = false;
	try {
		posterExists = statSync(file).isFile();
	} catch (_error: unknown) {
		SKIPPED_FOLDERS.push(srcFolderName);
	}
	if (!posterExists) {
		console.warn(`Poster image does not exist for: ${file}`);
		return;
	}

	// get ID from the folder name, which is like: "1_badalona_beach"
	const id = folderName.split('_')[0];
	if (!Number.isInteger(Number(id))) {
		console.warn(`ID is not numeric: ${folderName}, ${id}. Stopping`);
		return;
	}
	processImages({
		id: Number(id),
		file,
		sourceFolder: srcFolderName,
		originalFilename: '_poster.jpg',
		newFilenameWithoutExtension: '_poster',
	});
}

async function processImages({
	id,
	file,
	// sourceFolder,
	// originalFilename,
	// newFilenameWithoutExtension,
}: {
	/** id like: 1 */
	id: number;
	/** like /Volumes/DAZZLE_FILES/BCN Website Photos/Barcelona_Barrios_And_Places/Places/0_food/_poster.jpg */
	file: string;
	/** like /Volumes/DAZZLE_FILES/BCN Website Photos/Barcelona_Barrios_And_Places/Places/0_food */
	sourceFolder: string;
	/** like _poster.jpg */
	originalFilename: string;
	/** like _poster */
	newFilenameWithoutExtension: string;
}) {
	//   const metaData = await sharp.default(file).metadata();
	//   console.log(metaData);

	for (const rule of RESIZE_FOLDERS) {
		const destinationFolder = path.join(DESTINATION_FOLDER, rule.name);

		// @todo - make folder if not exists

		// await mkdir(folder, { recursive: true });

		exportImage({
			width: rule.width,
			height: rule.height,
			inputFile: file,
			outputFilePath: destinationFolder,
			outputFileName: `${id}_poster.avif`,
		});
	}
}

async function exportImage(settings: ExportImageSettings) {
	const { width, height, inputFile, outputFilePath, outputFileName } = settings;

	const outputFile = path.join(outputFilePath, outputFileName);

	if (DRY_RUN) {
		DRY_RUN_FILE_LIST.push({ in: inputFile, out: outputFile });
		return;
	}

	try {
		await sharp
			.default(inputFile)
			.rotate() // auto orient image based on EXIF!
			.resize({
				width: width,
				height: height,
			})
			.avif({
				// quality: 60
				effort: 7,
			})
			.toFile(outputFile);

		console.log(`Processed: ${outputFile}`);
	} catch (error) {
		console.log(error);
	}
}
