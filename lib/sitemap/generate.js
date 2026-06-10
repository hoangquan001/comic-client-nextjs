/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs-extra");
const zlib = require("zlib");
const { create } = require("xmlbuilder2");
const path = require("path");

const { DataSource } = require("./datasource");
require("dotenv").config({ path: path.resolve(process.cwd(), ".env.local") });
require("dotenv").config();

const DOMAIN = process.env.DOMAIN;
const IP_ADDRESS = process.env.DB_HOST;
const PORT = process.env.DB_PORT;
const USER = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
const DATABASE = process.env.DB_NAME;
const DEFAULT_FOLDER = "public";
const SITEMAP_INDEX_FILE = "sitemap.xml";
const MAIN_SITEMAP_FILE = "sitemap-main.xml";
const NEW_CHAPTER_SITEMAP_FILE = "sitemap-chapter.xml";
const OLD_CHAPTER_LIMIT = 20000;
const COVER_IMAGE_BASE_URL = "https://cdn1.anhtruyen.com/coverimg";

const STATIC_ROUTES = [
  { path: "/", priority: "1.0", changefreq: "hourly" },
  { path: "/tim-truyen", priority: "0.9", changefreq: "daily" },
  { path: "/gioi-thieu", priority: "0.45", changefreq: "monthly" },
  { path: "/lien-he", priority: "0.35", changefreq: "monthly" },
  { path: "/the-loai", priority: "0.8", changefreq: "weekly" },
  { path: "/so-do-website", priority: "0.5", changefreq: "weekly" },
  { path: "/cau-hoi-thuong-gap", priority: "0.45", changefreq: "monthly" },
  { path: "/dieu-khoan", priority: "0.25", changefreq: "yearly" },
  { path: "/chinh-sach-bao-mat", priority: "0.25", changefreq: "yearly" },
  { path: "/ban-quyen", priority: "0.25", changefreq: "yearly" },
  { path: "/tro-ly-ai", priority: "0.8", changefreq: "daily" },
  { path: "/truyen-hot", priority: "0.9", changefreq: "hourly" },
  { path: "/xep-hang", priority: "0.85", changefreq: "hourly" },
];

class SitemapGenerator {
  constructor(sitemapFile = "sitemap.xml", type = "sitemap") {
    this.sitemapFile = sitemapFile;
    this.type = type;

    if (type === "sitemap") {
      this.doc = create({ version: "1.0", encoding: "UTF-8" }).ele(
        "urlset",
        this.rootAttributes()
      );
    } else if (type === "sitemapindex") {
      this.doc = create({ version: "1.0", encoding: "UTF-8" }).ele(
        "sitemapindex",
        this.rootAttributes()
      );
    }
  }

  rootAttributes() {
    const attributes = {
      xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
    };

    if (this.type === "sitemap") {
      attributes["xmlns:image"] = "http://www.google.com/schemas/sitemap-image/1.1";
    }

    return attributes;
  }

  addUrl(loc, lastmod = null, priority = "0.5", changefreq = null, images = []) {
    const url = this.doc.ele("url");
    url.ele("loc").txt(loc);
    url.ele("lastmod").txt(lastmod || new Date().toISOString().split("T")[0]);
    if (changefreq) url.ele("changefreq").txt(changefreq);
    url.ele("priority").txt(priority);

    // Add image sitemap data if provided
    if (images && images.length > 0) {
      images.forEach((image) => {
        const imageElement = url.ele("image:image");
        imageElement.ele("image:loc").txt(image.url);
        if (image.caption) imageElement.ele("image:caption").txt(image.caption);
        if (image.title) imageElement.ele("image:title").txt(image.title);
      });
    }
  }

  addSitemap(loc, lastmod = null) {
    const sitemap = this.doc.ele("sitemap");
    sitemap.ele("loc").txt(loc);
    sitemap
      .ele("lastmod")
      .txt(lastmod || new Date().toISOString().split("T")[0]);
    console.log(`Added Sitemap: ${loc}`);
  }

  async save(folder = "", needGzip = false) {
    const xmlString = this.doc.end({ prettyPrint: true });
    const fullPath = path.join(folder, this.sitemapFile);

    await fs.outputFile(fullPath, xmlString, "utf-8");
    console.log(`Sitemap saved to ${fullPath}`);

    if (needGzip) {
      const gzPath = `${fullPath}`;
      const fileContents = fs.createReadStream(fullPath);
      const writeStream = fs.createWriteStream(gzPath);
      const zip = zlib.createGzip();

      fileContents
        .pipe(zip)
        .pipe(writeStream)
        .on("finish", () => {
          fs.removeSync(fullPath);
          console.log(`Sitemap compressed to ${gzPath}`);
        });
    }
  }

  clearAll() {
    const rootName = this.type === "sitemap" ? "urlset" : "sitemapindex";
    this.doc = create({ version: "1.0", encoding: "UTF-8" }).ele(
      rootName,
      this.rootAttributes()
    );
    console.log("All URLs have been cleared from the sitemap.");
  }
}

function sitemapUrl(fileName) {
  return `${DOMAIN}/${fileName}`;
}

function oldSitemapFile(index) {
  return `sitemap-chapter-${index}.xml`;
}

function getOldSitemapCount(totalChapters) {
  if (totalChapters <= OLD_CHAPTER_LIMIT) return 0;
  return Math.floor((totalChapters - 1) / OLD_CHAPTER_LIMIT);
}

function chapterLoc(comicUrl, chapterUrl) {
  return `${DOMAIN}/truyen-tranh/${comicUrl}/chuong-${chapterUrl}`;
}

function normalizeImageUrl(image) {
  if (!image) return null;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  if (image.startsWith("/")) return `${DOMAIN}${image}`;
  return `${COVER_IMAGE_BASE_URL}/${image}`;
}

function comicImages(comic) {
  const imageUrl = normalizeImageUrl(comic.coverImage);
  if (!imageUrl) return [];

  return [
    {
      url: imageUrl,
      title: comic.title || undefined,
      caption: comic.title ? `Thumbnail truyện ${comic.title}` : undefined,
    },
  ];
}

async function getExistingOldSitemapCount(folder) {
  try {
    const files = await fs.readdir(folder);
    return files.filter((file) => /^sitemap-chapter-\d+\.xml$/.test(file)).length;
  } catch {
    return 0;
  }
}

async function removeGeneratedSitemaps(folder, includeOld = false) {
  const files = [
    SITEMAP_INDEX_FILE,
    MAIN_SITEMAP_FILE,
    NEW_CHAPTER_SITEMAP_FILE,
  ];

  if (includeOld) {
    try {
      const oldFiles = await fs.readdir(folder);
      files.push(...oldFiles.filter((file) => /^sitemap-chapter-\d+\.xml$/.test(file)));
    } catch {
      // The folder may not exist on the first run.
    }
  }

  await Promise.all(files.map((file) => fs.remove(path.join(folder, file))));
}

async function generateMainSitemap(folder, allComics, allGenres) {
  const mainGenerator = new SitemapGenerator(MAIN_SITEMAP_FILE);
  mainGenerator.clearAll();

  for (const route of STATIC_ROUTES) {
    mainGenerator.addUrl(
      `${DOMAIN}${route.path}`,
      null,
      route.priority,
      route.changefreq
    );
  }

  for (const comic of allComics) {
    mainGenerator.addUrl(
      `${DOMAIN}/truyen-tranh/${comic.url}`,
      null,
      "0.85",
      "daily",
      comicImages(comic)
    );
  }

  for (const genre of allGenres) {
    if (!genre.slug) continue;
    mainGenerator.addUrl(
      `${DOMAIN}/the-loai/${genre.slug}`,
      null,
      "0.75",
      "daily"
    );
  }

  await mainGenerator.save(folder);
}

async function addChaptersToSitemap(generator, chapters, comicUrlById) {
  for (const chapter of chapters) {
    const comicUrl = comicUrlById[chapter.comicid];
    if (!comicUrl) continue;

    generator.addUrl(
      chapterLoc(comicUrl, chapter.url),
      null,
      "0.7",
      "daily"
    );
  }
}

async function generateOldChapterSitemaps(
  folder,
  dataSource,
  comicUrlById,
  oldSitemapCount
) {
  for (let index = 1; index <= oldSitemapCount; index += 1) {
    const offset = (index - 1) * OLD_CHAPTER_LIMIT;
    const chapters = await dataSource.allChapters(
      "id,comicid,url",
      offset,
      OLD_CHAPTER_LIMIT
    );

    const chapterGenerator = new SitemapGenerator(oldSitemapFile(index));
    await addChaptersToSitemap(chapterGenerator, chapters, comicUrlById);
    await chapterGenerator.save(folder);
  }
}

async function generateNewChapterSitemap(
  folder,
  dataSource,
  comicUrlById,
  oldSitemapCount
) {
  const offset = oldSitemapCount * OLD_CHAPTER_LIMIT;
  const chapters = await dataSource.allChapters(
    "id,comicid,url",
    offset,
    OLD_CHAPTER_LIMIT
  );

  const chapterGenerator = new SitemapGenerator(NEW_CHAPTER_SITEMAP_FILE);
  await addChaptersToSitemap(chapterGenerator, chapters, comicUrlById);
  await chapterGenerator.save(folder);
}

async function generateSitemapIndex(folder, oldSitemapCount) {
  const idxGenerator = new SitemapGenerator(SITEMAP_INDEX_FILE, "sitemapindex");
  idxGenerator.clearAll();
  idxGenerator.addSitemap(sitemapUrl(MAIN_SITEMAP_FILE));

  for (let index = 1; index <= oldSitemapCount; index += 1) {
    idxGenerator.addSitemap(sitemapUrl(oldSitemapFile(index)));
  }

  idxGenerator.addSitemap(sitemapUrl(NEW_CHAPTER_SITEMAP_FILE));
  await idxGenerator.save(folder);
}

async function generateSitemap(folder = DEFAULT_FOLDER, mode = "all") {
  const dataSource = new DataSource(IP_ADDRESS, PORT, USER, PASSWORD, DATABASE);

  try {
    const [allComics, allGenres, totalChapters] = await Promise.all([
      dataSource.allComics(),
      dataSource.allGenres(),
      dataSource.countChapters(),
    ]);

    const comicUrlById = {};
    allComics.forEach((comic) => {
      comicUrlById[comic.id] = comic.url;
    });

    const oldSitemapCount = getOldSitemapCount(totalChapters);
    const shouldGenerateOld = mode === "all" || mode === "weekly";
    const shouldGenerateHourly =
      mode === "all" || mode === "hourly" || mode === "weekly";
    const existingOldSitemapCount = shouldGenerateOld
      ? 0
      : await getExistingOldSitemapCount(folder);
    const activeOldSitemapCount = shouldGenerateOld
      ? oldSitemapCount
      : Math.min(oldSitemapCount, existingOldSitemapCount);

    await removeGeneratedSitemaps(folder, shouldGenerateOld);

    if (shouldGenerateHourly) {
      await generateMainSitemap(folder, allComics, allGenres);
    }

    if (shouldGenerateOld) {
      await generateOldChapterSitemaps(
        folder,
        dataSource,
        comicUrlById,
        oldSitemapCount
      );
    }

    if (shouldGenerateHourly) {
      await generateNewChapterSitemap(
        folder,
        dataSource,
        comicUrlById,
        activeOldSitemapCount
      );
      await generateSitemapIndex(folder, activeOldSitemapCount);
    }
  } finally {
    await dataSource.close();
  }
}

if (require.main === module) {
  const mode = process.argv[2] || "all";
  const folder = process.argv[3] || DEFAULT_FOLDER;

  if (!["all", "hourly", "weekly"].includes(mode)) {
    console.error(
      "Usage: node lib/sitemap/generate.js [all|hourly|weekly] [output-folder]"
    );
    process.exit(1);
  }

  generateSitemap(folder, mode).catch((error) => {
    console.error("Failed to generate sitemap:", error);
    process.exit(1);
  });
}

module.exports = {
  generateSitemap,
  getOldSitemapCount,
  OLD_CHAPTER_LIMIT,
};
