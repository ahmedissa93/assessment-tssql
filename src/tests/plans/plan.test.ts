import {  beforeEach, describe, expect, it } from "vitest";
import { createAuthenticatedCaller, createCaller,setupUser } from "../helpers/utils";
import { db, schema } from "../../db/client";
import { eq } from "drizzle-orm";
import resetDb from "../helpers/resetDb";


describe("plans routes", async () => {
  describe("create", async () => {
    it("should create Plane successfully", async () => {
      await resetDb()
      const plans = [{
        name: "Basic",
        price:500     
      },
      {
        name: "Monthly",
        price:1000     
      }];
      const user = {
        email: "mail@mail.com",
        password: "P@ssw0rd",
        name: "user",
        timezone: "Asia/Riyadh",
        locale: "en",
        isAdmin:false
      };
      const admin = {
        email: "admin@mail.com",
        password: "P@ssw0rd",
        name: "admin",
        timezone: "Asia/Riyadh",
        locale: "en",
        isAdmin:true
      }
      const registeredUserRes = await createCaller({}).auth.register(user);
      const registeredAdminRes = await createCaller({}).auth.register(admin);

      const adminInDb = await db.query.users.findFirst({
        where: eq(schema.users.email, admin.email),
      });          
      const createPlan = await createAuthenticatedCaller({
        userId:adminInDb!.id,
      }).plans.create(plans);
      
      expect(createPlan.success).toBe(true);
    });
  });
  describe("update", async () => {
    it("should update Plane successfully", async () => {
      const plan = {
        name: "Monthly",
        price:1500 ,
        id:2     
      };
      const admin = {
        email: "admin@mail.com",
        password: "P@ssw0rd",
        name: "admin",
        timezone: "Asia/Riyadh",
        locale: "en",
        isAdmin:true
      }
      const adminInDb = await db.query.users.findFirst({
        where: eq(schema.users.email, admin.email),
      });    
      const createPlan = await createAuthenticatedCaller({
        userId:adminInDb!.id,
      }).plans.update(plan);
      
      expect(createPlan.success).toBe(true);
    });
  });
  describe("get", async () => {
    it("should read Plane successfully", async () => {
      
      const user = {
        email: "mail@mail.com",
        password: "P@ssw0rd",
        name: "test",
        timezone: "Asia/Riyadh",
        locale: "en",
      };
      const userInDb = await db.query.users.findFirst({
        where: eq(schema.users.email, user.email),
      });    
      const createPlan = await createAuthenticatedCaller({
        userId:userInDb!.id,
      }).plans.get();
      
      expect(createPlan.plans);
    });
  });
  describe("is user read", async () => {
    it("should user read Plane successfully", async () => {
      
      const user = {
        email: "mail@mail.com",
        password: "P@ssw0rd",
        name: "test",
        timezone: "Asia/Riyadh",
        locale: "en",
      };
      const userInDb = await db.query.users.findFirst({
        where: eq(schema.users.email, user.email),
      });    
      const readPlane = await createAuthenticatedCaller({
        userId:userInDb!.id,
      }).plans.get();
      
      expect(readPlane.plans);
    });
  });
  describe("is user create plane", async () => {
    it("should user create Plane successfully", async () => {
      const plans = [{
        name: "Basic",
        price:500     
      },
      {
        name: "Monthly",
        price:1000     
      }];
      const user = {
        email: "mail@mail.com",
        password: "P@ssw0rd",
        name: "test",
        timezone: "Asia/Riyadh",
        locale: "en",
      };
      const userInDb = await db.query.users.findFirst({
        where: eq(schema.users.email, user.email),
      });    
      const readPlane = await createAuthenticatedCaller({
        userId:userInDb!.id,
      }).plans.create(plans);
      
      expect(readPlane.success);
    });
  });
  describe("a prorated upgrade price calculation ", async () => {
    it("a prorated upgrade price calculation  successfully", async () => {
      const plans = [{
        name: "Basic",
        price:500     
      },
      {
        name: "Monthly",
        price:1000     
      }];
      const user = {
        email: "mail@mail.com",
        password: "P@ssw0rd",
        name: "test",
        timezone: "Asia/Riyadh",
        locale: "en",
      };
      const userInDb = await db.query.users.findFirst({
        where: eq(schema.users.email, user.email),
      });    
      const upgradePlan = await createAuthenticatedCaller({
        userId:userInDb!.id,
      }).plans.upgradePlan({daysRemaining:10});
      
      expect(upgradePlan.success);
    });
  });
});
