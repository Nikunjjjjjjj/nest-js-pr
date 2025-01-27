// NPM modules
import * as uuid from 'uuid';

class CommonUtil {
  public constructor() {
    // TODO
  }
  /**
   * @param pMessage
   * @returns
   */
  public consoleLog(...pMessage: any): boolean {
    // if (currentENV === 'local') {
    console.log(new Date(), pMessage);
    // }
    return true;
  }
  /**
   * @param str
   * @returns
   */
  public extractNumbers(str: string): any {
    if (str) {
      const matches: any = str.match(/(\d+)/);
      if (matches) {
        return matches[0];
      }
    }
    return null;
  }
  /**
   * @returns
   */
  public generateUniqueId(): string {
    return uuid.v4();
  }
  /**
   * @param length
   * @returns
   */
  public generateRandomNumber(length: number): any {
    return (
      Math.floor(Math.random() * (9 * 10 ** (length - 1))) + 10 ** (length - 1)
    );
  }
  /**
   * @param length
   * @returns
   */
  public generateRandomString(length: number): any {
    return Math.round(
      Math.pow(36, length + 1) - Math.random() * Math.pow(36, length),
    )
      .toString(36)
      .slice(1);
  }
  /**
   *
   * @param arr1
   * @param arr2
   * @returns
   */
  public haveCommonValueInArray(arr1: any[], arr2: any[]) {
    const set1 = new Set(arr1);
    const commonItems = arr2.filter((item: any) => set1.has(item));
    return commonItems.length > 0;
  }
}

export default new CommonUtil();
