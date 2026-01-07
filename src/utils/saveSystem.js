import { logger } from './logger.js';
import { deepClone } from './helpers.js';

const SAVE_KEY = 'antifragile_life_save';
const AUTO_SAVE_KEY = 'antifragile_life_autosave';

/**
 * 存档系统
 */
export const saveSystem = {
  /**
   * 保存游戏状态
   * @param {Object} state - 游戏状态
   * @param {boolean} isAutoSave - 是否自动存档
   */
  save(state, isAutoSave = false) {
    try {
      if (!state) {
        logger.warn('Attempted to save null state');
        return false;
      }

      const saveData = {
        version: '1.0.0',
        timestamp: Date.now(),
        state: deepClone(state),
        metadata: {
          chapterIndex: state.chapterIndex,
          turn: state.turn,
          title: state.title,
          gameOver: state.gameOver
        }
      };

      const key = isAutoSave ? AUTO_SAVE_KEY : SAVE_KEY;
      const saveString = JSON.stringify(saveData);
      localStorage.setItem(key, saveString);

      logger.info('Game saved', {
        isAutoSave,
        chapter: state.chapterIndex,
        turn: state.turn
      });

      return true;
    } catch (error) {
      logger.error('Failed to save game', { error, state });
      return false;
    }
  },

  /**
   * 加载游戏状态
   * @param {boolean} isAutoSave - 是否加载自动存档
   */
  load(isAutoSave = false) {
    try {
      const key = isAutoSave ? AUTO_SAVE_KEY : SAVE_KEY;
      const saveString = localStorage.getItem(key);

      if (!saveString) {
        logger.info('No save file found', { isAutoSave });
        return null;
      }

      const saveData = JSON.parse(saveString);

      if (!saveData.state) {
        logger.warn('Invalid save file format');
        return null;
      }

      logger.info('Game loaded', {
        isAutoSave,
        chapter: saveData.metadata?.chapterIndex,
        turn: saveData.metadata?.turn,
        timestamp: saveData.timestamp
      });

      return saveData.state;
    } catch (error) {
      logger.error('Failed to load game', { error, isAutoSave });
      return null;
    }
  },

  /**
   * 删除存档
   * @param {boolean} isAutoSave - 是否删除自动存档
   */
  delete(isAutoSave = false) {
    try {
      const key = isAutoSave ? AUTO_SAVE_KEY : SAVE_KEY;
      localStorage.removeItem(key);
      logger.info('Save deleted', { isAutoSave });
      return true;
    } catch (error) {
      logger.error('Failed to delete save', { error, isAutoSave });
      return false;
    }
  },

  /**
   * 获取存档元数据
   * @param {boolean} isAutoSave - 是否获取自动存档元数据
   */
  getMetadata(isAutoSave = false) {
    try {
      const key = isAutoSave ? AUTO_SAVE_KEY : SAVE_KEY;
      const saveString = localStorage.getItem(key);

      if (!saveString) return null;

      const saveData = JSON.parse(saveString);
      return saveData.metadata || null;
    } catch (error) {
      logger.error('Failed to get save metadata', { error, isAutoSave });
      return null;
    }
  },

  /**
   * 检查存档是否存在
   * @param {boolean} isAutoSave - 是否检查自动存档
   */
  exists(isAutoSave = false) {
    try {
      const key = isAutoSave ? AUTO_SAVE_KEY : SAVE_KEY;
      return localStorage.getItem(key) !== null;
    } catch (error) {
      logger.error('Failed to check save existence', { error, isAutoSave });
      return false;
    }
  },

  /**
   * 导出存档（用于备份）
   */
  export() {
    try {
      const saveString = localStorage.getItem(SAVE_KEY);
      if (!saveString) return null;

      const blob = new Blob([saveString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `antifragile_life_save_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      logger.info('Save exported');
      return true;
    } catch (error) {
      logger.error('Failed to export save', { error });
      return false;
    }
  },

  /**
   * 导入存档（用于恢复备份）
   * @param {File} file - 存档文件
   */
  async import(file) {
    try {
      const text = await file.text();
      const saveData = JSON.parse(text);

      if (!saveData.state) {
        logger.warn('Invalid import file format');
        return false;
      }

      localStorage.setItem(SAVE_KEY, text);

      logger.info('Save imported', {
        chapter: saveData.metadata?.chapterIndex,
        turn: saveData.metadata?.turn
      });

      return true;
    } catch (error) {
      logger.error('Failed to import save', { error });
      return false;
    }
  },

  /**
   * 清除所有存档
   */
  clearAll() {
    try {
      localStorage.removeItem(SAVE_KEY);
      localStorage.removeItem(AUTO_SAVE_KEY);
      logger.info('All saves cleared');
      return true;
    } catch (error) {
      logger.error('Failed to clear saves', { error });
      return false;
    }
  }
};

/**
 * 自动存档管理器
 */
export class AutoSaveManager {
  constructor(interval = 60000) {
    this.interval = interval;
    this.timer = null;
    this.state = null;
  }

  /**
   * 启动自动存档
   * @param {Function} getState - 获取当前状态的函数
   */
  start(getState) {
    this.stop();

    this.state = getState;

    this.timer = setInterval(() => {
      if (this.state) {
        const currentState = this.state();
        if (currentState && !currentState.gameOver) {
          saveSystem.save(currentState, true);
        }
      }
    }, this.interval);

    logger.info('Auto-save started', { interval: this.interval });
  }

  /**
   * 停止自动存档
   */
  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      logger.info('Auto-save stopped');
    }
  }

  /**
   * 立即执行一次自动存档
   */
  saveNow() {
    if (this.state) {
      const currentState = this.state();
      if (currentState) {
        return saveSystem.save(currentState, true);
      }
    }
    return false;
  }
}

export const autoSaveManager = new AutoSaveManager(60000);
