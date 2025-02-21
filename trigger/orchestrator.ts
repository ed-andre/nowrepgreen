import { task } from "@trigger.dev/sdk/v3";
import {
  syncBoards,
  syncBoardsTalents,
  syncBoardsPortfolios,
  syncPortfoliosMedia,
  syncTalents,
  syncTalentsPortfolios,
  syncTalentsMeasurements,
  syncTalentsSocials
} from "./sync-tasks";

export const orchestrateSyncTask = task({
  id: "orchestrate-sync",
  run: async () => {
    await Promise.all([
      syncBoards.trigger(),
      syncBoardsTalents.trigger(),
      syncBoardsPortfolios.trigger(),
      syncPortfoliosMedia.trigger(),
      syncTalents.trigger(),
      syncTalentsPortfolios.trigger(),
      syncTalentsMeasurements.trigger(),
      syncTalentsSocials.trigger()
    ]);
  }
});

