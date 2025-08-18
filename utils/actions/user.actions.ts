"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { appWriteConfig } from "../appwrite/config";
import { cookies } from "next/headers";

export const getUserByEmail = async (email: string) => {
  try {
    const { databases } = await createAdminClient();
    const result = await databases.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.usersCollectionId,
      [Query.equal("email", [email])]
    );

    return result.total > 0 ? result.documents[0] : null;
  } catch (error) {
    console.log(error, "Error from getUserByEmail");
  }
};

export const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient();
  try {
    const session = await account.createEmailToken(ID.unique(), email);

    return session.userId;
  } catch (error) {
    console.log(error, "Error from email otp");
  }
};

export const createAccount = async ({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) => {
  const existingUser = await getUserByEmail(email);
  const accountId = await sendEmailOTP({ email });

  if (!accountId) throw new Error("Failed to send an OTP");

  if (!existingUser) {
    const { databases } = await createAdminClient();

    await databases.createDocument(
      appWriteConfig.databaseId,
      appWriteConfig.usersCollectionId,
      ID.unique(),

      {
        fullName,
        email,
        avatar:
          "https://img.freepik.com/premium-photo/3d-avatar-cartoon-character_113255-103130.jpg",
        accountId,
      }
    );
  }

  console.log("account created successfully");
  return JSON.parse(JSON.stringify({ accountId }));
};

export const verifySecret = async ({
  accountId,
  password,
}: {
  accountId: string;
  password: string;
}) => {
  try {
    const { account } = await createAdminClient();
    const session = await account.createSession(accountId, password);
    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return JSON.parse(JSON.stringify({sessionId:session.$id}))
  } catch (error) {
    console.log("Failed to verify OTP", error);
  }
};

export const getCurrentUser = async () => {
  const {databases,account} = await createSessionClient();

  const result = await account.get();

  const user = await databases.listDocuments(appWriteConfig.databaseId,appWriteConfig.usersCollectionId,[Query.equal("accountId",result.$id)])

  if(user.total<=0)return null;

  return  JSON.parse(JSON.stringify(user.documents[0])) 
}