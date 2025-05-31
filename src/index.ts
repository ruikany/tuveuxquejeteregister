import puppeteer, { Browser, Page } from "puppeteer";

async function checkCourse(courseName: string) {
  let browser: Browser | null = null;
  let waitlistOpen: boolean = false;
  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const url: string =
      "https://vsb.mcgill.ca/criteria.jsp?access=0&lang=en&tip=3&page=criteria&scratch=0&advice=0&legend=1&term=202509&sort=none&filters=iiiiiiiiii&bbs=&ds=&cams=MACDONALD_DOWNTOWN_DISTANCE_OFF-CAMPUS&locs=any&isrts=any&ses=any&pl=&pac=1";
    await page.goto(url);
    await page.type("#code_number", courseName);
    await page.keyboard.press("Enter");
    await page.waitForSelector(".legendSelect", { timeout: 5000 });

    const isFull = await page.evaluate(() => {
      const element = document.querySelector(".legendSelect");
      return element?.classList.contains("bg_red");
    });
    return !isFull;
  } catch (err) {
    console.log(err);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
  return waitlistOpen;
}

(async () => {
  let open: boolean = false;
  const courses: string[] = ["comp 321", "comp 551", "comp 512"];
  for (const course of courses) {
    try {
      open = await checkCourse(course);
      console.log(
        `${course} is ${open ? "open to register/waitlist" : "completely full, try later"}`,
      );
    } catch (err) {
      console.log(`timed out, too many requests: ${err}`);
    }
  }
})();
