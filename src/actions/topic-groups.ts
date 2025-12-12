"use server";

import { prisma } from "@/lib/prisma";
import type { HubType } from "@prisma/client";

/**
 * Get all topic groups for a specific hub type (speaking or grammar)
 */
export async function getTopicGroups(hubType: HubType) {
  return await prisma.topicGroup.findMany({
    where: { hubType },
    orderBy: { order: "asc" },
  });
}

/**
 * Get a topic group with its speaking scenarios
 */
export async function getTopicGroupWithScenarios(groupId: string) {
  return await prisma.topicGroup.findUnique({
    where: { id: groupId },
    include: {
      speakingScenarios: true,
    },
  });
}

/**
 * Get a topic group with its topics (for grammar)
 */
export async function getTopicGroupWithTopics(groupId: string) {
  return await prisma.topicGroup.findUnique({
    where: { id: groupId },
    include: {
      topics: true,
    },
  });
}

/**
 * Get speaking scenarios by topic group name
 */
export async function getSpeakingScenariosByGroup(groupName: string, subcategory?: string) {
  const group = await prisma.topicGroup.findFirst({
    where: {
      name: groupName,
      hubType: "speaking",
    },
  });

  if (!group) return [];

  return await prisma.speakingScenario.findMany({
    where: {
      topicGroupId: group.id,
      ...(subcategory && { subcategory }),
    },
  });
}

/**
 * Get grammar topics by topic group name
 */
export async function getGrammarTopicsByGroup(groupName: string, subcategory?: string) {
  const group = await prisma.topicGroup.findFirst({
    where: {
      name: groupName,
      hubType: "grammar",
    },
  });

  if (!group) return [];

  return await prisma.topic.findMany({
    where: {
      topicGroupId: group.id,
      ...(subcategory && { subcategory }),
    },
  });
}
