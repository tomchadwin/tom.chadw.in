import { default as Allocator } from "../../src/Allocator.mjs";

describe("Allocator", function() {
	it("deallocates entire allocated block at zero", function() {
		const allctr = new Allocator();

		// 		console.log(allctr._points);
		let start = allctr.allocateBlock(10);
		expect(start).toBe(0);
		expect(allctr._points).toEqual(
			new Map([
				[0, Object({ free: false, next: 10 })],
				[10, Object({ free: true, next: Number.MAX_SAFE_INTEGER })],
			])
		);
		start = allctr.allocateBlock(20);
		expect(start).toBe(10);
		expect(allctr._points).toEqual(
			new Map([
				[0, Object({ free: false, next: 30 })],
				[30, Object({ free: true, next: Number.MAX_SAFE_INTEGER })],
			])
		);
		allctr.deallocateBlock(0, 30);
	});

	it("deallocates several blocks", function() {
		const allctr = new Allocator();

		let start = allctr.allocateBlock(10000);
		expect(start).toBe(0);

		allctr.deallocateBlock(1000, 100);
		allctr.deallocateBlock(2000, 200);
		allctr.deallocateBlock(3000, 300);
		allctr.deallocateBlock(4000, 400);

		// prettier-ignore
		expect(allctr._points).toEqual(
			new Map([
				[    0, { free: false, next:  1000 }],
				[ 1000, { free:  true, next:  1100 }],
				[ 1100, { free: false, next:  2000 }],
				[ 2000, { free:  true, next:  2200 }],
				[ 2200, { free: false, next:  3000 }],
				[ 3000, { free:  true, next:  3300 }],
				[ 3300, { free: false, next:  4000 }],
				[ 4000, { free:  true, next:  4400 }],
				[ 4400, { free: false, next: 10000 }],
				[10000, { free:  true, next: Number.MAX_SAFE_INTEGER }],
			])
		);

		allctr.deallocateBlock(0, 20);
		start = allctr.allocateBlock(50);
		expect(start).toBe(1000);
		start = allctr.allocateBlock(300);
		expect(start).toBe(3000);
		start = allctr.allocateBlock(20);
		expect(start).toBe(0);

		// prettier-ignore
		expect(allctr._points).toEqual(
			new Map([
				[    0, { free: false, next:  1050 }],
				[ 1050, { free:  true, next:  1100 }],
				[ 1100, { free: false, next:  2000 }],
				[ 2000, { free:  true, next:  2200 }],
				[ 2200, { free: false, next:  4000 }],
				[ 4000, { free:  true, next:  4400 }],
				[ 4400, { free: false, next: 10000 }],
				[10000, { free:  true, next: Number.MAX_SAFE_INTEGER }],
			])
		);

		// Deallocate at start
		allctr.deallocateBlock(1100, 110);

		// Deallocate entire block
		allctr.deallocateBlock(2200, 4000 - 2200);

		// Deallocate at end
		allctr.deallocateBlock(9500, 500);

		// prettier-ignore
		expect(allctr._points).toEqual(
			new Map([
				[   0, { free: false, next: 1050 }],
				[1050, { free:  true, next: 1210 }],
				[1210, { free: false, next: 2000 }],
				[2000, { free:  true, next: 4400 }],
				[4400, { free: false, next: 9500 }],
				[9500, { free:  true, next: Number.MAX_SAFE_INTEGER }],
			])
		);
	});
});
