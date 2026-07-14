---
title: "⚾ LGAI 8기 모델 경량화 및 실전 머신러닝 파이프라인 가이드북"
date: 2026-07-14
tags: ["lg-aimers"]
thumbnail: "data:image/gif;base64,R0lGODlhZABkAPcAAAMDAQsLAQEBDAcJCBYWAgECFQEFGwMJHQoMGwcKFRMTGw8PDyooBDEuDAEGIgMKJAoNJAMNKgkOKwMFKRMOKAwRJQURLQsSLAYSJxYWKQEOMgINOAQSMwsUMwUVOwoWOgwaPAwZOBMcOxYZNSYaOBsiOxwkJSgmKiYoOzU2NS41MyEfC0I9AVBMD09QL21qLWhkGQMVQg0cQwcaSRIdQhgeRAQcVwAOQQ4hTBQiRBskQxQjTBslShwpSAwiWBQlUxcoWB0yWiQqRCstRCUoSC0xSysxSDQ0SzY2SCUsUykzVzc5VTYrTgAdZQwkZAglaRQrZxsxaQgpeBMtdhgyeQ4ydig2Zzk8YyQ6diEvZSgeQEM8V0I+Tko7aTxBWjhEb0dEWlVVTnNzTEZIZklKdVdYdlNQbWZTd21vdFxkbj9CJYN+N4+LOJ6ZLJCOTbKuV66rbZmXYcS+YtDLceTdcfTsePv0e/LpbtLLWAYriAwziRY1iAUulQkzmxg6lhEtgQo5rAg2pRg9pQo8sww+uyE8hhlFmhlGjC1LkhxEqQ1AvQ9AtxxGuB5VuCNHqChWqyNKuClYtzNbrDZltldYhEtTjWdbilZlj2dmiWpolXh3mXJtkUtrsW93qERbpA1Cww5EzBJGyg5G0hJK1RNN2hFH0xRT3Rdb3R9TwCVWyCRUyipl1TNt0BZa4Rto5R116x588CJ27CF+8Cdt6Rxg3UZ51kh1ymJ/w4V5mZF1mI94qptuqXmGrniEjiWH9CyW+DKS8zOk/DSk9FGJ2W6R0VSY6U2R6muZ6FSn83as9X2i23bC/ImNk5aHqZqWuY6KsqiJtauTuauvsamulNPQieLdivPth/v0g/v1ivr1lO7okdXXq/LvrefcrpebyLKaxYyq2Lenyrmq1Lq02KqqzIuy7rG65Mm32Mqx1NK85Mib0ZTJ97DN8rjm+LzK0crF3NLL2M3G5tjJ5trU6N7V89bP9uLW7efZ9ejR8czv/Ovk+vXn/fz0/+v2+eHj1L3AkSH5BAAAAAAALAAAAABkAGQAAAj+AG0JHEbw2LBatmohtMVpEiuHrFitmkjRGLKLF4shK5ZsmbJ17Nq1y0cyn8hlyy4KC8aypctgv37BjOmrpi9YOF/p1Omq1axWQFuZGkqqKKlSSKXo0XPIkKFHUCdNslVwXbKOx4wBW6VK1cRaGjdq1Ihy3ciSI0W2W4fyYsuVLmPKlWvz5s5Xs1652tuqZ9ChpowWLSVJ6iRJiKEqNuTo0dNIkVil6kpZFStjmC0K0yhsWDFit8qJJkZw2DGMyJIhMyYM7sy5wHz9qptTr15YfP0KNdVKMFKkhxAhkhRpEqeBx2odu7osWbmNrFBJR9X1srFhmYsVmzQM2EGFtYb+PUyVqlGjqaxiAUMGc+br2bRru9o5q6fu3oEFHy0las+eKlUw5Z9/evjRVFNQQQYJI4wsCAkkqRBUCzDAGFPMML4YIxFltnDVFSqpoMKgKtKxchEwdNUUm02vyKfXXvUFBRRvpORHyiii5CiKJJw0ZBwnpSF0zJBDDmNLJAsmkgghgkA4oXLHFGPMKg51VQoklGEZCiONMMggJEpGMoswFNbFYk2w7LTXmjEGVaONN+IoCiig+ODDE09Ukecf/jXWGHGTRPJIIo4oSaggiUDCSi0PKZQKJKgs2OCXD3q5iJeGOmXIKlqZWdNdPL24plC9FWXKKKPwNyedrEriyST+iAA4RRWOcBKJLY4QB1mgjmkqyK+Q1PJopYQ2CCYjTTYJya/M/uqHIH740YcfhkRW1yuyyPKKL6DOB6NQpMjoW5xzfgIKgHriiecekhhIaCRg2XKMVcscY4ggw04CiSOO/Novv832C+3A0fpRoB976JHwHn00Mksssdi25sR8BUXLjETdeKOOq37yCSLBIeKEnU448YQUfEabSC2DcpTMOo3eYsu+jkRrSLTO+lFIwTxH28eAf/xBBRVTTPGHHo2k5y3FrpzS9F+lCpaqquV6TAghwgkHBckmPzEFFUcvZbBThyAECa787rxHz9HusXMha0fLp8JBEz2rFEVXoVT+KqtMTMtep7QS+F+mnKIf1Tl6bPXVT9z5xMg2cG1yFTv74cjNfSxlyB5p6+wf3H/ArXMhQZPuR9CoU1HFFHgXDQUUU+RZxaarnLIKLbScorvuuwGW3yikcKzj4lcTwoknPXpipw822NBEyV7HzS/Ce4SuM597YEF66KVvv73QRRf9xOtQqPv6405AIUUiteteuPu8ZUwUqqnqSKfinxRPyPI4LO8DFFGIwtZsYDKj7eFmfzBaIUiXha+BbQpYSODXsFC0BobvglMomQ/S9zofAOF/JtMDkrqEilH4ziiBCQyqSjG1jlktf1cbxCWEgwWtRQELWKBCFJzQPAI64Wv+pCsaBbPwuincMAtUQOLXiJgFJhIRCiXroP+m+ME76U0KeegDqmrExcEUhX5IYRUoXhhDQgwChzrE4dacEAUdAmEG/Yuc82AHQSxAgYhAeF0UpkDEKDwRCE4gYvpKBoQfOOEHPkCkD3DQv0X+oJH/K58U+BAKjYliMEgZRSg0GYpO4g+GgwilKBnJyEc+kpFsXGQMSMk8O0EBC1H4HxBmmccA0nKWP7ilBwv5g17+YAaPBCYcZ7ADUtogj05oAh9QwcIt/gYpqxrjGPGniGqKchCBCAIpQYADD+TAA/3bGhxjQE4czGAGkbPCLXn5gyAkYZY88OU7f7ADX9JzB8X+3AENanDPH8iAlOacgZ2aoIdQsPCgvxFFKaapOEJU06FmFGUgABEIbloUBCDIATcjOYNV4sCj5/RBFnpZSHbyoJA84AE+U6pSfO5ApTXYQUxpkIOa0uCmO5DBP2cgg176gKCMUOgzS9HJTjL0aooonigpOlFAfCGjJSiBB6aKURwEAQgfjYEHtBqDju4gCCv9AUtZmoQkpLQHPUipDl66gxy8lAc1qEFNX2rTmuZABjnAgQzO2YQ9MAIUBl1oKFgVivx9MqlLHcQiAsHYiuJABCEAQQhC4IGqzrKjW5UBOcm5AyDMdaxn1QERiJBWHaS0BjzQQQ50oIMk9EAHJYD+rQ7QqgMR3DWjd92r8/z6icEW1lyGhSEoBwEIiTK1sUHIgQhKANnJUhYHs+wmOae6WRn0oKY86MFodSAEtPJgtEQQgmhrIFrWCqEEo+2BEIgg2u2u1q4g+IAMaNC8PxBCcZ7En/5iKNHG+pcPO4jqZDvgXHBGV6uVBYFOYyADILR1tuANb3mHUIQhWHgIo8XwEES7BCUUwQggLkIRiBBbtGIUBCI4pw30IAiHKqKhimCEIq5JY0AcNxB8aKx8O1CCEHSgAxzgADhz+QMPCJm6IPBmEnIQWyIMwQgjFoKUhXBhJjDhwhYeMRGKsAQvLAHEUA7vda+LUZ2i8w/F3a/+Gfm7VIreuLF8yHFyQzACH1vgxxzoaSERfGT50uC13B3CEZZwBBQIAQVORsEQroyEISDhCEgQcYeN0GUvHKEIly5rd3tQAozWNAY2+IMgrrnmUC6CuDZONWP7wFg+9KEPOY4zBz5A5xEA2QIfyLMvZaCBIB/ZA9ZlrYW5wIUlKJoIKEABEoiNhGYTmwuDXsIYOqyEJSzhwxU2QndLoNEQfDrUggDEqK+Zahv717+sjjOO48wHJeSAznYGMgeIiVUP9NrIfUaropEABjBw4cJISAG/udDsaIPBy2PwgsKvbQQMh1e81313CHIK6j+wurjFRbW5G8vqVac7ELBmNx/+PEBrOnfAAkHWgAw6KwN7+zrIRs5Bw5UNhjGAYdkCJ3i/t7AEnnd5DFdI+BGGPoTzRjW2R+/xB3hAzhlIwQ+MFcREwz11j68ax68WucitoAR4YwDlQAZBL1vea1+7PARgRoIZ0rCFZ3PB32+/ORiufQUvWzvLFkZBVEdw9OaCIJ4/sAEU/oAwaVkd5Fl/dchFnofGN54PX4iBcy9ggcpHAAT1lMHLfa2BXotgCQEPgxneHgYwbAEMZtiC6q1N6C1z2QjJprKi9y6CEaD1xyGgwVbRaQM8oUwPfFBYtIAPfMYH//GObzwigiACAl/gAhK489KBwOsIoDwCHOh8rzH+0IODg+EMYAhDGM4g+jOYYQw8f3SjUXAEMJBhC0UQgQ6KIIQRPP8CfPcxB0Iggw14YAMAeAPkdAM9ZD548wer8wcog0XJ13hN0ARf4AMDdn8SgH2Z53IWEAEaoIERYH0WsARfMAZp0G9ncAabgAlnUAboN3dEhwSstwRJEHQ6gAEY8AAP0IEEdnLepH082HkA6AE3EIS8xzVN0DwPiEUM2Hh2VAMjMAIcAH2VxwFupVP2toEd2HnWFwEdQARjUAZmsARcgAnN8Ay6gAk2Z23NhgQ8t15X8AVWwAETMAE26AAP4AASEALN5wE9wAEdyIFXqAEbAIgAOIgbMF0BuAH+N9AEDIiEWJAFM/BjIyABz4cBHIBPOKBRGOUBfbiJETABI5AEXjAGTDAGz5AJl0AGhIYCI4ACTMBlV0AGZXAFIDABEWCDdegAdDgBHdADILCLfNiBtNiHG4iFwxgBgQiIGuiDNyAFUqCIzchHMdAB9mcBFVAB0edWegVsMvABnRgBDsCJDsABPWAFSUAEV9AFsLgJm4AGmNCOmFAGZKAEs0iLt4iLB1CHEVBWkMUD3niDnEiLwaiBE0CMybiBE3ADvueMVGAFNSCNF1ABD4AB1ldTGaVgLdeNneiPN8gBVwAEZaUESkBa59WEGWBrHRCHA1mHBwABDnAAK+kAE3D+BWWgBLX1i3IIkAHZjQPJgcOofQF4MsyIJ3dEAxSQAfcHAQ9gARR5VzQgAyHAhzbYh3TYiRpAA19ABp5oATbIkgYwAXYoAWTwDJUAhy2JiywZh5bwDJRgBT3QAd+Yi97Yj8EYjFbYg9kXhzNgMkfYBI0YA5J4ARCAlDdoWxa5jZr4ABWIi2+pmBOQBEogjUJAAQ7AkhAwARAgARtQCZnwDGTwAfbYkgZABM8wDt7QCWSQBCHgjYqpmPiIi50Yh8DYk32IiL33gA+YBUBQAxRwARQAkRIZAblHayBAAzGQaygpAXK4mjC5AUxIAkNQAhQQnZNZmTVABJlgDtBACTL+IAG4KAKYMA71YA7ewAuVgJqrWY/n+ZY46ZMcsAEHGRyHIAV7IAiSgJs0IIkQuZI2GJwhUAOvyAQfYJlMYAZMcAGfiYueSATRiQIkMAIZgAAGUJlEQAnoUA/eQAldIG2bEA3x0KHmQA5i2XWqqZx0qJxz+Jo9OAFOUA7H8AiO4AmS4Ag1kASR2AEUIAEPwJLA2WkbQAbi8A2ZoAUTQALR8A2boAUOYABJiqAOcAaYUAIIQAEjQAIKgAAQkAAkEA74UA/kkKHoaAm7MA4dOg7kQJ6oWYu3eAAGsKZsuqYkOpDa14lPMAl68AS22QRxxYQ3KgESUIMHIIU5MAGagA/+6aALTEABlkCo0MAECJCkboqLS0AP8dAMacAFDJoBGcAF0WAP8nAP6ZAJV3COSdAFmxAO8UCanXAFSiACEYCjKqmmbRqrq3mFnbgBX3AYkoAIezA0NUADtsabFRCYNtgBGcUBzbAP+LALJKAF6IAP+JALJNCmuFiHWiAO+tAP/aAP8yAP6SAP9sCp9qAP9aALlEAGltAFXWAJuhAOpJkJblgCN4gBiqmaa1oA9WoA9qqk3yiQE7ABiEAFeiAJRxIJwxBXHSAB1giREHCPEaBcIiAOnroJFIAL+1AP4rAFLImL+pqUFqAJ+qAP+9AP+3AP+wAP6JAO9kCy+OANmWD+CZ2ArpawCaM5Dp3wBVcAr9/YAbeoi45aAD6br4/6jXG4AZ6ACE+gB4nwCMMwCXEVidUYrI16mTlAA0yQDviADmZAAumwD4UqmQc6lQ6gA/GwDx+rD/TwDtEAD/hwDyS7D+fQCZVQCV1QCZRACZjgDeZgml3nkknJAdyJmDZ4APb6s4O7pl4JkxqATj5wCMOADI/wBHElAnwanVIKAQYgATUAAl1QD/egDluwCSObDmdgAC6pr9OqhQZwBtmarfaADuhwDynLtp7aCZbgCZmQCZRQCWTgDONQrklwAfdoi3yqmLCar4TLporJATYQA0/ACckwDD6ACN+lmxBQlJj+oAtnQAEQUHtkcA/1gA5MEA77MA/icASkq6YH4JodGJXOoK3zMA/vMA/6kLL2sKXqQA7ioAudoAuWQAaXUKaVUAY5gAH3yJpeyaZAS7g+i6+GuwNQUAWSYBrxaQvVWQMSUL0ZEA34EA1MYIcOkAne+w1MgA77IA/OIJkumb4l2qod6ABC8A72MA/2AA/6ALs27Kz1kA7Q0Am4WwnPQA6XUAZeUAIjAAHyqsIaG6sIrMAFAJPIQwWTUAyS4ARVgAio1ZDVCwG5sA/okL0Qigue6g1McA73MA+60KhJSgHu6ZX+yKcGUAbvqw/+8K34sA8jKw/o8A23sAuWkAWWsJn+L+sFTlYC1fgAKUy8awqrsfqzaxoDyoAIPtAjeVkFVEADWpAENRCYCHAGnooLRVwAuFAP59AMXdCpzxqYBkCKlkADLdyB3OkAoNwP9DC/25rH4pAO6XAO6qAO5+qycMtwhVYBGMCSKlyHpFuiDIyvg+uzB/AFlYADNlAFywtFVlxWMsCbCMAEhJoLWoAACYAJ9JAOzrAF8mC2m4CvY0AP46ALWBmMiemozDC/3yoPu9AFZ7C1+6AOu3AG6ZoJqSoERaAEXoAE9kfMwXuesJoAi6ykO7BV/dNRPlAFnOCRNSAD2hud0HAPzYCxqUwP9PANZtCp9rAJWCoP+xAPLDv+Am/ZqkkquAjACx4tw/gADSWYC7tw0zCbCfWsA9I2bUQMvGXZyqCpyPW6wDAZZCBQA1z1BYjQRDnVARVwAQiABlyMCRlQAORMD+KABvFwD/IgDQrQDPyArOGwCVvwjUnJnWyqpmXwDu/QqTqsDtBw07ugmerYCR1WBpRQBkvwnFxZwC2skoacwguNixwgAh9gZBowAVYQBT9AA1BdAQnABfogD7iwBQiwBPIwD+ggDs7aqeggD2N9tZawBZKphd7IwHRoAEPQDPEwD4S6y3O9C7rwDM/AC5igBJigCbjt0wfqj7loi8QruAqspNgXZDgKSz5wzRXQmxQgvs4gsST+4NnnEK74cA51zLb4AA/qkAtccNonmaT5epkGQAHM8L6Eig67rA4/+gya4AWZ4Ay3jQnnJwL2yLCBjda1iKbizcQGINwGYEdQ8AN82twFAAYlHA1nwAXhIA9qiw/catL6gA/h0AzoAA1dIJlfJwGKPJ1JigCbANvO6qzpYA7i8AxlwAtkCqKasAlmYKAteQAjuolR2cL9zcRAawDJgwUR8JAVgAAFIA38cA65sKEnS+LNiqzpsAsjDA/7rNIHK96kG7i4WABm4A5m69Gn6gzxzQ7u4A7k4AxiTgb3fYM3qN/rS+OgSbgCIABGfQDKcAzlMNG8GZgFkAb8cA8XXqT+6hDa6QAP8ICs6oAGJEACzbDBWnCD3Cm4Ux7jC1sAQ+AMbv0O4iDmYgq/lC4O4fANRTCtLommoC6VZ47MylwAbu7mxywac54FB6u9CEAC88APrfsN3wAN3+C6Vuus0IAGTLACu7APiyq5B8zMBKykCyuR8U0O5MCur/2+8HsO7xAPzpCYn86JnLiB9kjMRW3qbW6vB6DqxBAFIKDJECAA0cAPEK4O0bAL0BAOfy4PzgoPCk4C6nAPpc0EfjsBDHwAkp0A/p4Af8oL7sC74RAO0f6+gB4P8iAP57ywwZuBSbmJVki8tQiapX7qpDsk5XALDHnBDqAACYAG/FDZ6BD+DXPd5yhrx+meC1arC3wN8eKdAAIAAAAQAAFA8wnAC/0gDc3wDtA+D/AwD/4Q9NF+BDfItzUokZZneS2sr/1oyArc5m6u6reABTUwARSAAAggAFww1ni87s0QDeigtipvsiat589wBROglWo68w0gBnAQ93EgBiuABtjKDLhwDkDv7PA7D+Qw6jL+mzeIchagARnY0mhuzKXus21+C0VbCVawARAAod6MAvaA7hfeDOwe2vcw1sjqrHYcD5hwsN54AAkAAG6gDdiADdmQDaxPB/+wDUNfBsww9nzvDv2ACTJu5jW4vkzfhy5Jh2ZOr0zs5k3URFc/+QbgzRkADyP+Lw/hMNfQENp17A8qb8f38AySaeYGgPrZUAfXQAdy8AZzsPrYoA3/4A/SgASbgA7+4A+y//4mAPADAAAD8O8JEPEdyIeI34etWbwAUcBAgQICamhJQmNDhwkGEhwwgAAdP33z0EHbBU2dv30dPd6jd26JgQkPIkQA0EBbHWxuCAAAQKDFHGx2qk3zxywFGm7afHKD02AFABdiVBBYwSBAAgwWOJyM4EAq1AdVq0IYOFAgwQkTHEwgMcIBgogICkjjt+9eum/Rdn2T57HjPXnhMElwEEFCVQAvstl5A3NAggEAVtCpY+3ftHnSxGzLZk2yz20M3nDj1iIOt20pEjj+jYDhQIIEEEyGtpoXIsGtBbo6gDBCglkDEQswS3sPnrpoveOm7WgPXSaxUqte6Pu3TYDBBw4sIPCmzjU4vaT588e5WjVrd+xQYyDHWrUGcrJxa5Dg5AUBMGEewHDywUOHELVupUAhYn6ytSEgQCMtfYRTh7d09uGHInzk8YaJ2g4w7gGi/prjpQEWUCCABuaYDg4xpIHHn23+iWONNuywIw4G6LBjjhWvoYYApjAgKg44PCRggAqcW0ANE5hbjaCBEKCAMAUUECgBCTqAAAl9+LnHnnTQKfC3ffTBZ5wzsHrQpPkAoOaaOuRgIQAzA1ijO2vE+HAbEUmE4Q0UYWj+AMU3WvAOjgCOBECMbLDJJlAXB0CAKMziAEBIgQYSgLQAVDihAASW7EACCMLJTR55qERHn7niwUWE2gyAsCoJDkipGmywsUaON+AQj6U5XEDDmW16qmYOPOy4Aw+ZUGSjBRTdACCBCa0ZE7Fs/ikWABgCJba2BLYyQIETrj2BAggukECCCy4w4Awo6ZInnd7w0YeeeZwhojaBIKTKWAbg+MsaO1YFdFYXepnm1mtQ5PWOO9rAwzsY1rDjmhcuJIAOa7J5AQAG8LBGmxYKc+NhGAAgCyLnDDhhBRNWUACBCrjVwFsJmNHnHnzs2TSaZuDBJx5ntnBAK1KdQ6Bn0mD+agGPOu6gw1UxXggDDWakcacaOgoWOOFrBL6jBTeuuaaFAIjC5prAtoYB0IgDeOMabVgA4MHaciYAwwUOqGCvbvEagx56XE4nnXB00WSceMgZw13WIJrWPfcImMMOOpRawYU00rDOHXekcaONoQF7AzGBN7SjDgZgigPrFgAorAVtsmEjpsSrGeohB5yDEEMFKMAAAwn0eqAhTfqZB2a2oMFFF3HIKUO/+woYbYEbj26AAA29kyMAAlSAfGl/3OlFDTFWwubrFe3Ag4FqWnR+ADmuWXwwAFh4mNgGpptja1KlyvmAwWavICrYpRpDH3003ZsudPGMTJABXAdgzbv+UsKNQLGqaAUDDAMYoAY0wIFpvTABATJWh2zAwXnrswY22sA+rwFAemGqEKGcdTo2BKAF1qAO6Q5QlY8ZQACNol1oYGcACGDADPGwxzmi8YxOdOISVyhOkAiCKhP8gxp0uAa+UCSwalBjDtT4xzbQEIAwQOYa2XDD1oz1LBGGrSUmJECY5EC6BQDADYCCQQBekDBiPeQBrxvVAhAAAQlggIZaOcAIJkAEctBjHN4o4BVE8IAdJpBUCTATA1zwAjfAYQ7VCFSgJIMNbVSmAZipxsKKRaOMZaMFCMvGxsyEwhwNAHGcbEAA3niNjTXqYx5LwB65pT+deesBFcAEJr7+kIMQeAV2qxGAkGBnLMMFgAEsgAEb3jAHh2VjG0MRQxwI0LYB1I5s17BGC05kMdIBAA7/0lpfVgUHE8LhXg0g3aIcYoCxKEkCFtAfa+jJxwvMEALG8djHCiKk14mmAANo1AAKg8bGqaEBLgjDhQZgJhU8BAMVWMDqGrCranzOWH4hWjSRZcqYUENxQ0nmqHY2uyVZwAKM1FmprPLH+ozmeM75YzJ5Bp8eeOELvSjBAia6gNrVzgszxAACGsAdOTDAOxVKFCTp9bBVoc6E4mvR1nQa0ASYIAMu5UB8HpCVdzlHKhBA4NrQqpWUzvABa33XAy6AgRB44RK94IUR4FP+AQzkRTReyAAGLvAAFwTqDXWyAzsHk1QNUsMn1BgbAFrwp8CklCzUGgEfO9CB+EQlgYuqYZdMQ5BkCmBnJknAqBzwAHwq4RK8UIY5ehCapjygdgfwAgY4ENYUwAGyL2AVsbrZAQvQiAANaB4ABFAYv1hjDcVKbQ0JUqSWujQCd0yrolpzgOvO57P0tIq7VntPDLzWG+tgBwgiQNzrXhcDJegAByxwAQRMtE+YEQMA4OPS4jJzMD97YyqVizznTGsgCjAABohrgQXvRYkJxCkEKnA8gfh1rAM5wD0foAQiloMd7MiBdfNSXAv0gL/zPcByV/DQFQigKSGAMYNrx8j+BAiAbJxE27vclRWswMalC7ZAH7HrsQgx8rNxxV1WuMvZXrzWHB8GQVP4K18LGIG/HXgAQXakUIvCOAQc+DJnI4BAAbySdcXambRqQwEEuLUqoYlAkLvlR1Od5sGq1YtnkXcSC5TAG1/gBTvywY4Q6JbK8g1BGkLgFA44AHkhmKuUEe0BDnxgty9FYEmzEb9ESZdRGVAAhCz85tB0C87dhamQVPuA2+EFw+t1QBmcEYVhCDq9Jw4rXXtRaA40xAAPWDQHOLvbEHggBB+wND5zVhATNuAEylXbfQyAAv3gFNXtncB1b3dHRgZJKrXJnYhrc5IORMAZlwC0rUPMgTf+29YCu57AS0l1gS9zwNjF9oCxdytfmN6wPTC5oY5bYwAV0GZ/U4lKalYr0IG+9XUOuB0+7bMkDCjhz4johKDdse6XzjQNJnBpzhwQX0vnu9hgprRYl31D5fq7UYJzVwIiNU96itwBTcFAtv2YM8GZ9gL6O4mG07qkB2iiE1fwBCfMUQ8QXxqf1z0AGEJgEoiwFuXF/jKlLx0VtrLc344kawEykMzojkrUttWLg3tOECHPUANP4bkDXFoCXpChEp7gRTnyUQ+OB90CuC3BAbDimg584NjItrTToW7D9rjc5azpD0FOMPZkqvpBEfq2uypvgF1K5Z6nAvdg7YoITnD+ghjg+HAJatfe0DhABSUg1UCWZO9975u/qXb81498H0hloMYpTRKR8ciogqT0nifx/JhJVbsQCPMLplcGOMphjh3Ip90OyMCEh94Brdc+zvkkbe5VPXDWYMsESEpp7OUpuO/28eny8ZhoMJGGLyBCEpxQhofLUX3r0/CXZo+A2gMNOFu53Ks8y3skssKWyTuSnkHABDrAJToN+YiK1xkzI3gGLbCCSig9YlCGD5stCci2O+ou+6Cn3dKAOHs/PCq+4nM87RooR1rAawE1BJiWwTkyCMuLk+ishxONMjCDEbACjFMGZTi9deC/O8oLvEArIXmArfs+rnNBAwy41KL+sKwwABO4lhRIAQasALBziNbQQZOwLux6qwtYAiEQgitABE8ghnIoB3AABxzYOVQTPAQSiAeIL6j4J817vCl0uQcRjWNyjhPgwhRQgSM5P+MLAQ2YgB1yABHIgLgiQaiTqRFAgSEggiuohFu4BemLQxwIOjobqwlzQhGsQDx6wdJqvH/bPDdjpG47xBNQgATIALPIMBD4gSCIAijwASj4AjcEByVAngjpLuO4rhIogSJIAivwhFs4hg9kB3MIgq+4LtWIiBv8Na9YLRZ8PFZkOeVqucFRQghxDi6kxQUANeS5gBz4ASCAAioohPsbhmMghiiIOyVUuKqoABTIgCUjaEZO6ITo8zB2sILXEDUMs6G4yotvA8TPEsdWDLh3kQoTDAgAOw=="
---

![IMG_0725.GIF](data:image/gif;base64,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)

본 가이드북은 **DACON LGAI-EXAONE-4.0-1.2B 모델 경량화 해커톤** 참가자 및 실전 테이블형 머신러닝 엔지니어를 위해 작성되었습니다. 대형 언어 모델(LLM)의 **W4A16 GPTQ 양자화(Quantization)** 파이프라인과 이를 활용한 하이브리드 야구 데이터 분석 체계를 상세히 설명합니다.

* * *

## 📌 목차

1.  [해커톤 개요 및 대상 모델 분석](#1-%ED%95%B4%EC%BB%A4%ED%86%A4-%EA%B0%9C%EC%9A%94-%EB%B0%8F-%EB%8C%80%EC%83%81-%EB%AA%A8%EB%8D%B8-%EB%B6%84%EC%84%9D)
    
2.  [W4A16 GPTQ 양자화의 기술적 원리](#2-w4a16-gptq-%EC%96%91%EC%9E%90%ED%99%94%EC%9D%98-%EA%B8%B0%EC%88%A0%EC%A0%81-%EC%9B%90%EB%A6%AC)
    
3.  [실전 경량화 파이프라인 구현 코드 가이드](#3-%EC%8B%A4%EC%A0%84-%EA%B2%BD%EB%9F%89%ED%99%94-%ED%8C%8C%EC%9D%B4%ED%94%84%EB%9D%BC%EC%9D%B8-%EA%B5%AC%ED%98%84-%EC%BD%94%EB%93%9C-%EA%B0%80%EC%9D%B4%EB%93%9C)
    
4.  [데이콘(DACON) API 연동 및 최종 제출 절차](#4-%EB%8D%B0%EC%9D%B4%EC%BD%98dacon-api-%EC%97%B0%EB%8F%99-%EB%B0%8F-%EC%B5%9C%EC%A2%85-%EC%A0%9C%EC%B6%9C-%EC%A0%88%EC%B0%A8)
    
5.  [EXAONE 경량화 모델과 GBDT의 하이브리드 야구 분석 응용 전략](#5-exaone-%EA%B2%BD%EB%9F%89%ED%99%94-%EB%AA%A8%EB%8D%B8%EA%B3%BC-gbdt%EC%9D%98-%ED%95%98%EC%9D%B4%EB%B8%8C%EB%A6%AC%EB%93%9C-%EC%95%BC%EA%B5%AC-%EB%B6%84%EC%84%9D-%EC%9D%91%EC%9A%A9-%EC%A0%84%EB%9E%B5)
    

* * *

## 1\. 해커톤 개요 및 대상 모델 분석

본 해커톤의 핵심 목표는 제공된 클라우드 GPU 서버 환경에서 **LGAI-EXAONE/EXAONE-4.0-1.2B** 기본 모델의 추론 속도를 높이고 메모리 점유율을 낮추는 **경량화(Compression)** 작업을 수행하는 것입니다. 1.2B 파라미터 크기의 모델은 모바일 및 에지 장비에서 동작하기 적합한 경량 모델이지만, 여전히 일반적인 싱글 GPU나 CPU 환경에서는 추론 지연이 발생할 수 있습니다.

### 1) 경량화의 필요성

*   **메모리(VRAM) 절감**: FP16/BF16 포맷의 1.2B 모델은 모델 가중치 로드에만 약 2.4GB 이상의 VRAM을 요구합니다. 이를 4-bit로 양자화하면 가중치 크기가 약 600MB 이하로 줄어들어 캐시 메모리 효율과 서빙 처리량(Throughput)이 극대화됩니다.
    
*   **추론 대역폭 한계(Memory-bound) 극복**: 생성형 LLM 추론은 가중치를 메모리에서 프로세서로 계속해서 읽어오는 과정에서 대역폭 병목이 발생합니다. 가중치를 압축하면 데이터 전송량이 줄어들어 초당 토큰 생성 수(Tokens per second)가 비약적으로 상승합니다.
    

### 2) llmcompressor 라이브러리 도입

과거에는 양자화를 위해 복잡한 별도의 C++ 컴파일 라이브러리가 필요했으나, 최신 허깅페이스 생태계에서는 `llmcompressor` 라이브러리를 활용해 PyTorch 환경 내에서 간결하게 **원샷(Oneshot) GPTQ 최적화**를 수행할 수 있게 되었습니다.

* * *

## 2\. W4A16 GPTQ 양자화의 기술적 원리

### 1) GPTQ (Generalized Post-Training Quantization)

GPTQ는 대표적인 사후 양자화(PTQ) 알고리즘으로, 사전 학습이 완료된 가중치 매트릭스 $\\mathbf{W}$를 더 낮은 비트(예: 4-bit)로 압축할 때 발생하는 평균 제곱 오차(MSE)를 최소화합니다 \[30\]. 단순한 라운딩(Rounding) 방식과 달리, GPTQ는 입력 값들의 공분산 역행렬(Hessian Matrix $\\mathbf{H}$) 정보를 반영하여 **한 가중치를 양자화할 때 생기는 오차를 주변 가중치들이 역으로 보정(Error Compensation)하도록 유기적으로 조정**합니다.

### 2) W4A16 (Weight 4-bit / Activation 16-bit) 스키마

*   **W4 (Weight 4-bit)**: 모델의 가중치($\\mathbf{W}$) 정보를 16개의 정수 레벨(0~15 또는 -8~7)로 맵핑하여 표현합니다. 이를 통해 모델 디스크 크기 및 메모리 로딩 공간을 75% 절감합니다.
    
*   **A16 (Activation 16-bit)**: 추론 과정에서 계산되는 텐서의 활성화 값(Activation)들은 원본 정밀도인 16-bit(BF16 또는 FP16)를 유지합니다. 활성화 값까지 4-bit로 극단적으로 줄일 경우 언어 모델의 언어 이해 능력과 퍼플렉서티(Perplexity)가 극심하게 붕괴하는 현상(Representation Collapse)이 발생하는데, W4A16은 이를 완벽히 방어하면서 성능 하락을 최소화합니다.
    

### 3) 가중치 보존 정책 (Ignore Targets)

모델의 모든 레이어를 무차별적으로 4-bit로 줄이면 치명적인 정보 손실이 일어납니다. 특히 다음 레이어들은 반드시 \*\*16-bit 원본 상태로 유지(Ignore)\*\*하여 추론 정확도를 보존해야 합니다:

*   `embed_tokens` **(토큰 임베딩 레이어)**: 텍스트 토큰을 고차원 잠재 벡터 공간으로 매핑하는 첫 단추로, 이곳이 왜곡되면 뒤이어 오는 모든 레이어의 입력에 회복 불가능한 노이즈가 전파됩니다.
    
*   `lm_head` **(언어 모델 출력 레이어)**: 최종적으로 다음 토큰의 확률 분포를 계산하는 선형 계층으로, 미세한 확률 차이(Logits)가 생성 품질을 결정하므로 정밀한 FP16/BF16 연산이 유지되어야 합니다 \[157\].
    

* * *

## 3\. 실전 경량화 파이프라인 구현 코드 가이드

제공된 DACON 주피터 노트북 스크린샷에 수록된 완전한 프로덕션 코드 블록입니다. 순서대로 작성되어 데이터 누수(Data Leakage)나 하드웨어 병목 없이 완벽하게 원스톱으로 빌드됩니다 \[148\].

### Block 1: 필수 라이브러리 임포트 (Imports)

```python
import os
import torch
import shutil
from pathlib import Path

from datasets import load_dataset
from transformers import AutoModelForCausalLM, AutoTokenizer

from llmcompressor import oneshot
from llmcompressor.modifiers.quantization import GPTQModifier
```

*   **설명**: 양자화 엔진인 `llmcompressor`와 허깅페이스의 `transformers`를 호출합니다. `oneshot` API는 가중치를 한 번에 최적화하는 데 사용되며, `GPTQModifier`는 양자화 규칙 및 타겟 레이어를 정의합니다.
    

### Block 2: 글로벌 환경 설정 (Settings)

```python
MODEL_ID = "./base_model"
OUT_DIR = "./model"

DATASET_ID = "LGAI-EXAONE/MANTA-1M"
DATASET_SPLIT = "train"

NUM_CALIBRATION_SAMPLES = 256
MAX_SEQUENCE_LENGTH = 512

# Quantization
SCHEME = "W4A16"
TARGETS = ["Linear"]
IGNORE = ["embed_tokens", "lm_head"]
```

*   **설명**:
    
    *   `MODEL_ID`: 서버 내의 원본 EXAONE 모델 폴더 경로입니다.
        
    *   `OUT_DIR`: 경량화가 완료된 압축 모델이 저장될 공간입니다.
        
    *   `NUM_CALIBRATION_SAMPLES`: GPTQ 최적화 시 가중치 변화에 따른 활성화 값 오차를 측정하기 위해 사용되는 **캘리브레이션 샘플 수**입니다. 256개 정도의 고품질 샘플로도 대표적인 도메인 특징을 충분히 잡아낼 수 있습니다.
        
    *   `TARGETS = ["Linear"]`: 모델 내의 모든 피드포워드(FFN) 및 어텐션 투영 선형 레이어를 타겟으로 지정합니다 \[72, 88\].
        
    *   `IGNORE = ["embed_tokens", "lm_head"]`: 앞서 언급한 정보 왜곡 최소화를 위해 임베딩과 헤드 레이어를 양자화 대상에서 강제 제외합니다.
        

### Block 3: 원본 모델 및 토크나이저 로드 (Model Loading)

```python
print("[INFO] 모델 로드 중...")

tokenizer = AutoTokenizer.from_pretrained(
    MODEL_ID,
    trust_remote_code=True,
)

model = AutoModelForCausalLM.from_pretrained(
    MODEL_ID,
    torch_dtype=torch.bfloat16,
)

print("[INFO] 모델/토크나이저 로드 완료")
```

*   **설명**: EXAONE은 최신 언어 표현 학습 아키텍처를 취하고 있어 원격 코드 실행 허용(`trust_remote_code=True`)이 필요합니다. 메모리 절약 및 부동 소수점 정밀도 유지를 위해 `torch_dtype=torch.bfloat16`을 사용하여 하드웨어 부하를 원천 차단합니다.
    

### Block 4: 캘리브레이션 데이터 로드 및 템플릿화 (Dataset Preprocess)

```python
print("[INFO] 캘리브레이션 데이터 로드 중...")

ds = load_dataset(
    DATASET_ID,
    split=f"{DATASET_SPLIT}[:{NUM_CALIBRATION_SAMPLES}]",
)

def preprocess(example):
    return {
        "text": tokenizer.apply_chat_template(
            example["conversations"],
            add_generation_prompt=True,
            tokenize=False,
        )
    }

ds = ds.map(preprocess)

print("[INFO] 데이터 전처리 완료")
```

*   **설명**: 모델이 실제 대화 맥락에서 중요하게 판단해야 하는 가중치를 학습할 수 있도록 대화형 데이터셋인 `MANTA-1M`을 로드합니다. `tokenizer.apply_chat_template`를 활용해 대화 데이터(Conversations)를 모델이 실제 서비스 시 접하게 될 표준 마크다운(Markdown) 프롬프트 텍스트 형태로 완벽히 포맷팅하여 직렬화(Serialization)합니다 \[108\].
    

### Block 5: 원샷 GPTQ 실행 (Quantization)

```python
print(f"[INFO] GPTQ 시작 (scheme={SCHEME}, samples={NUM_CALIBRATION_SAMPLES}, max_len={MAX_SEQUENCE_LENGTH})...")

recipe = [
    GPTQModifier(
        scheme=SCHEME,
        targets=TARGETS,
        ignore=IGNORE,
    )
]

oneshot(
    model=model,
    dataset=ds,
    recipe=recipe,
    max_seq_length=MAX_SEQUENCE_LENGTH,
    num_calibration_samples=NUM_CALIBRATION_SAMPLES,
)

print("[INFO] GPTQ 완료")
```

*   **설명**: 정의된 레시피를 기반으로 `oneshot` 최적화 함수가 실행됩니다. 각 타겟 레이어 단위로 전방 패스(Forward pass)를 수행하면서 Hessian 기반 보정 연산이 이루어지며 가중치들이 4-bit 값으로 변환됩니다.
    

### Block 6: 압축 모델 저장 (Model Save)

```python
os.makedirs(OUT_DIR, exist_ok=True)

model.save_pretrained(OUT_DIR, save_compressed=True)
tokenizer.save_pretrained(OUT_DIR)

print(f"[INFO] 모델 저장 완료: {OUT_DIR}")
```

*   **설명**: 저장 시 \*\*`save_compressed=True`\*\*가 매우 중요합니다. 이 설정을 인가해야 4-bit 가중치가 실제 물리 파일 상으로도 패킹 및 압축되어 물리적 디스크 점유율을 크게 낮출 수 있습니다.
    

### Block 7: 제출용 압축 파일 자동 패킹 (Submission Prep)

```python
zip_name = "baseline_submit"
print(f"[INFO] {zip_name}.zip 생성 중...")

shutil.make_archive(
    base_name=zip_name,
    format="zip",
    root_dir=".",
    base_dir=OUT_DIR,
)

print(f"[INFO] 생성 완료: {zip_name}.zip")
```

*   **설명**: 생성된 압축 모델 디렉토리를 통째로 `baseline_submit.zip` 아카이브로 빌드하여 DACON 채점 서버가 즉시 읽어 들여 테스트할 수 있는 준비를 마칩니다.
    

* * *

## 4\. 데이콘(DACON) API 연동 및 최종 제출 절차

대회에서는 서버 내에 `dacon_submit_api` 모듈이 기본적으로 임베딩되어 있습니다. 코드 작성이 완벽히 끝나고 모델의 압축 무결성이 검증되면 다음 파이썬 스크립트를 작성하여 리더보드에 즉시 실시간 제출할 수 있습니다.

```python
from dacon_submit_api import dacon_submit_api

result = dacon_submit_api.post_code_submission_file(
    'baseline_submit.zip',      # 업로드할 압축 파일 경로
    'YOUR_DACON_API_TOKEN',    # 개인 프로필 페이지의 계정 관리에서 발급받은 개인 토큰
    '236689',                  # 본 해커톤 대회 고유 ID
    'TEAM_NAME',               # 데이콘 리더보드에 표기될 팀명
    'EXAONE-4.0-1.2B-W4A16-GPTQ-Base' # 제출 관련 설명 메모 (예: 기법 이름)
)

print(result)
```

⚠️ **제출 전 필수 체크리스트 (DACON Constraints)**:

*   제공된 GPU 환경 내 `/workspace` 경로 내부의 리소스만 참조했는지 확인하십시오.
    
*   양자화 완료 후 저장 시 `save_compressed=True`가 빠지면 용량 초과로 채점 오류가 날 수 있으므로 반드시 확인하십시오.
    
*   제출 파일인 `.zip` 내부에 모델 파일(`model.safetensors`) 및 토크나이저 설정 정보가 유실 없이 함께 아카이브 되었는지 더블클릭하여 검사하십시오.
    

* * *

## 5\. EXAONE 경량화 모델과 GBDT의 하이브리드 야구 분석 응용 전략

본 해커톤 대상인 **EXAONE-4.0-1.2B** 모델과 테이블형 분석의 절대적 강자인 **XGBoost / LightGBM**을 야구 분석에 결합하는 최신 머신러닝 아키텍처 전략입니다 \[53, 147\].

```
                     [야구 원시 데이터 (선수 기록 / 경기 로그)]
                                      │
                                      ▼
                      [1단계: EXAONE-1.2B 경량화 모델]
                         - 시맨틱 도메인 지식 주입
                         - CAAFE 방식 피처 코드 자동 생성
                                      │
                                      ▼
             [2단계: Leakage-free 파이프라인 (Pandas/Sklearn)]
                         - train_test_split(stratify=y)
                         - StandardScaler (Train에만 fit, Test는 transform)
                                      │
                                      ▼
                      [3단계: 고성능 GBDT (XGBoost/LightGBM)]
                         - 최적의 하이퍼파라미터 튜닝 (learning_rate↓, trees↑)
                         - 최종 승패 / 스코어 예측
```

### 1) LLM 직접 예측의 한계와 극복 지침

수십만 행의 야구 선수 통계 데이터를 LLM 프롬프트에 직접 한 행씩 집어넣고 예측을 지시(Direct Prediction, 예: LIFT 프레임워크)하는 구조는 **(1) VRAM 부족, (2) 높은 추론 지연 시간(Latency) 및 API 비용, (3) 숫자의 미세한 기하학적 대소 관계 연산 취약성** 등으로 인해 현실적으로 서빙이 불가능합니다 \[110\]. 따라서, \*\*"LLM은 도메인 의미 이해 및 파생 변수 로직 생성(Feature Engineering)에만 1회성으로 활용하고, 최종 수치 연산과 예측은 GBDT가 수행한다(CAAFE / OCTree 하이브리드 방식)"\*\*라는 지침을 엄격히 따라야 합니다 \[113, 118, 147\].

### 2) CAAFE (Context-Aware Automated Feature Engineering) 구현 절차 \[113, 138\]

1.  경량화된 EXAONE 모델에게 전체 데이터의 메타데이터(예: "ERA: 평균 자책점", "BABIP: 인플레이 타구 안타 비율", "FIP: 수비 무관 자책점")를 제공하고 도메인 지식을 유도합니다.
    
2.  모델에게 \*\*"투수의 구위와 경기 흐름을 반영할 수 있는 강력한 새 파생 열(Feature)을 생성하는 파이썬(Pandas) 코드를 작성하라"\*\*고 지시합니다 \[113\].
    
    *   _EXAONE 제안 예시_:
        
        ```python
        # 삼진율과 볼넷 비율을 이용한 구위 지표(K-BB%)
        df['K_BB_ratio'] = df['strikeouts'] / (df['walks'] + 1e-5)
        # 구장 효과를 보정한 파생 변수
        df['Adjusted_Runs'] = df['runs'] * df['park_factor']
        ```
        
3.  생성된 코드가 데이터 누수(Leakage)를 유발하는지(예: 훈련/검증 데이터 간의 Aggregate 연산이 섞여 있는지) 검토 후, 파이프라인에 주입합니다 \[148, 171\].
    

### 3) Leakage-Free 데이터 검증 및 GBDT 파이프라인 코드

최종적으로 야구 경기 결과를 예측하는 모델의 검증 신뢰도와 정확도를 쥐어짜기 위한 누수 차단 GBDT 파이프라인 템플릿입니다 \[148, 172\].

```python
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from xgboost import XGBClassifier
from sklearn.metrics import classification_report, roc_auc_score

# 1. Stratified Split (데이터 누수 방지 및 클래스 비율 보존)
X = df.drop(columns=["target_win"])
y = df["target_win"]

# 검증 세트를 완전히 격리
X_train_raw, X_test_raw, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)

# 2. StandardScaler (반드시 train 데이터로만 fit 수행)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train_raw)
X_test_scaled = scaler.transform(X_test_raw)  # Test는 transform만!

# 3. XGBoost 고수준 튜닝 레버 설정 [152]
xgb = XGBClassifier(
    n_estimators=1000,
    learning_rate=0.03,         # 학습률을 낮춰 미세 조정 및 일반화 강화
    max_depth=6,                # 의사결정 트리의 최대 깊이 제어로 과적합 방지 [43]
    subsample=0.8,              # 각 트리당 행 데이터의 80%만 무작위 사용 (Bagging 효과) [49]
    colsample_bytree=0.8,       # 각 트리당 열 데이터의 80%만 무작위 사용 [152]
    reg_lambda=2.0,             # L2 정규화 페널티 추가로 안정성 극대화 [31]
    random_state=42,
    n_jobs=-1
)

# 4. Early Stopping을 통한 과적합 방지 (학습 중 무개선 시 조기 종료) [52, 176]
# 훈련 세트 내부에서 20%를 조기종료를 위한 검증 세트로 완전 분리
X_tr, X_val, y_tr, y_val = train_test_split(
    X_train_scaled, y_train, test_size=0.2, stratify=y_train, random_state=42
)

xgb.fit(
    X_tr, y_tr,
    eval_set=[(X_val, y_val)],
    verbose=False
)

# 5. 최종 강건한 평가 수행 [18]
preds = xgb.predict(X_test_scaled)
probs = xgb.predict_proba(X_test_scaled)[:, 1]

print("=== 최종 테스트 세트 결과 ===")
print(classification_report(y_test, preds))
print(f"ROC AUC: {roc_auc_score(y_test, probs):.4f}")
```

이와 같이 경량화된 EXAONE-1.2B 모델로 **풍부한 야구 도메인 지식 파생 피처**를 자동 추출하고, 누수 없는 엄격한 데이터 검증 및 **XGBoost 앙상블 학습 파이프라인**을 연동하는 하이브리드 접근법을 취할 때, 단일 모델 대비 월등히 우수한 예측 성능과 압도적인 서빙 지연 속도 개선을 달성할 수 있습니다 \[44, 118, 147\].
