export class LcStrUtils {
  static jsonStringToHtml(jsonString: string): string {
    return jsonString
      .replace(new RegExp('[\\\\u00A0-\\\\u2666]', 'g'), function(c) { return '&#'+c.charCodeAt(0)+'' })
      .replace(new RegExp('\\\\n', 'g'), '<br/>')
  }

  /**
   * Take an underscore_case string and return a camelCase string.
   * Example: i_like_potatoes => iLikePotatoes
   *
   * @param {string} underscoreCase
   * @returns {string}
   */
  static underscoreToCamelCase(underscoreCase: string): string {
    return underscoreCase.replace(
      /(_[a-z])/g,
      function($1){return $1.toUpperCase().replace('_','');}
    );
  }
}
