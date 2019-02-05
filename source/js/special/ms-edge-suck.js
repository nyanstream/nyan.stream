'use strict'

/*
 * var вместо let используется, чтобы было можно получить доступ к переменной с помощью window['isEdge']
 */

var isEdge = /Edge\//.test(navigator.userAgent)
