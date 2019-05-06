import {
    AppiumDriver,
    createDriver,
    SearchOptions,
    UIElement,
    nsCapabilities
} from "nativescript-dev-appium";

import { isOnTheLeft } from "./helpers/location";
import { assert } from "chai";

describe("Action Bar scenario", async function () {
    let driver: AppiumDriver;

    describe("dynamically add/remove ActionItems", async function () {
        let firstActionItem: UIElement;
        let secondActionItem: UIElement;
        let toggleFirstButton: UIElement;
        let toggleSecondButton: UIElement;

        before(async () => {
            nsCapabilities.testReporter.context = this;
            driver = await createDriver();
            await driver.driver.resetApp();
        });

        afterEach(async function () {
            if (this.currentTest.state === "failed") {
                await driver.logTestArtifacts(this.currentTest.title);
            }
        });

        it("should navigate to page", async function () {
            const navigationButton =
                await driver.findElementByAutomationText("ActionBar dynamic");
            await navigationButton.click();

            const actionBar =
                await driver.findElementByAutomationText("Action Bar Dynamic Items");
        });

        it("should find elements", async function () {
            firstActionItem = await driver.findElementByAutomationText("one");
            secondActionItem = await driver.findElementByAutomationText("two");

            toggleFirstButton = await driver.findElementByAutomationText("toggle 1");
            toggleSecondButton = await driver.findElementByAutomationText("toggle 2");
        });

        it("should initially render the action items in the correct order", async function () {
            await checkOrderIsCorrect();
        });

        it("should detach first element when its condition is false", done => {
            (async () => {
                await toggleFirst();

                try {
                    await driver.findElementByAutomationText("one");
                } catch (e) {
                    done();
                }
            })();
        });

        it("should attach first element in the correct position", async function () {
            await toggleFirst();
            await checkOrderIsCorrect();
        });

        it("should detach second element when its condition is false", done => {
            (async () => {
                await toggleSecond();

                try {
                    await driver.findElementByAutomationText("two");
                } catch (e) {
                    done();
                }
            })();
        });

        it("should attach second element in the correct position", async function () {
            await toggleSecond();
            await checkOrderIsCorrect();
        });

        it("should detach and then reattach both at correct places", async function () {
            await toggleFirst();
            await toggleSecond();

            await toggleFirst();
            await toggleSecond();

            await checkOrderIsCorrect();
        });

        const checkOrderIsCorrect = async () => {
            await isOnTheLeft(firstActionItem, secondActionItem);
        };

        const toggleFirst = async () => {
            await toggleFirstButton.click();
        };

        const toggleSecond = async () => {
            await toggleSecondButton.click();
        };

    });

    describe("Action Bar extension with dynamic ActionItem", async function () {
        let toggleButton: UIElement;
        let conditional: UIElement;

        before(async () => {
            nsCapabilities.testReporter.context = this;
            driver = await createDriver();
            await driver.driver.resetApp();
        });

        afterEach(async function () {
            if (this.currentTest.state === "failed") {
                await driver.logTestArtifacts(this.currentTest.title);
            }
        });

        it("should navigate to page", async function () {
            const navigationButton =
                await driver.findElementByAutomationText("ActionBarExtension");
            await navigationButton.click();
        });

        it("should find elements", async function () {
            toggleButton = await driver.findElementByAutomationText("toggle");
            conditional = await driver.findElementByAutomationText("conditional");
        });

        it("should detach conditional action item when its condition is false", async function () {
            await toggle();
            const conditionalBtn = await driver.waitForElement("conditional", 1000);
            assert.isUndefined(conditionalBtn, "Conditional button should not be visible!");
        });

        it("should reattach conditional action item at correct place", async function () {
            await toggle();
            await checkOrderIsCorrect();
        });

        const checkOrderIsCorrect = async () => {
            await isOnTheLeft(toggleButton, conditional);
        };

        const toggle = async () => {
            await toggleButton.click();
        };
    });
});
