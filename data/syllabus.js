/* 由 tools/build-syllabus.mjs 生成，数据来源：NOI 大纲条目 + 洛谷 */
window.AKIOI_SYLLABUS = {
  "updated": "2026-11-11",
  "modules": {
    "M1": "编程基础与模拟",
    "M2": "排序与贪心",
    "M3": "数据结构",
    "M4": "搜索与枚举",
    "M5": "动态规划",
    "M6": "图论",
    "M7": "数学与数论",
    "M8": "字符串与其他"
  },
  "nodes": [
    {
      "id": "M1-1",
      "mod": "M1",
      "modName": "编程基础与模拟",
      "layer": 0,
      "level": 1,
      "t": "语言基础",
      "s": "顺序 / 分支 / 循环",
      "pre": [],
      "problems": [
        {
          "pid": "P1001",
          "name": "A+B Problem",
          "difficulty": 1
        },
        {
          "pid": "P1421",
          "name": "小玉买文具",
          "difficulty": 1
        },
        {
          "pid": "P1000",
          "name": "超级玛丽游戏",
          "difficulty": 1
        },
        {
          "pid": "P1909",
          "name": "[NOIP 2016 普及组] 买铅笔",
          "difficulty": 1
        },
        {
          "pid": "P1085",
          "name": "[NOIP 2004 普及组] 不高兴的津津",
          "difficulty": 1
        },
        {
          "pid": "P1424",
          "name": "小鱼的航程（改进版）",
          "difficulty": 1
        }
      ]
    },
    {
      "id": "M1-2",
      "mod": "M1",
      "modName": "编程基础与模拟",
      "layer": 0,
      "level": 1,
      "t": "数组与字符串",
      "s": "模拟实现",
      "pre": [
        "M1-1"
      ],
      "problems": [
        {
          "pid": "P1047",
          "name": "[NOIP 2005 普及组] 校门外的树",
          "difficulty": 1
        },
        {
          "pid": "P1563",
          "name": "[NOIP 2016 提高组] 玩具谜题",
          "difficulty": 2
        },
        {
          "pid": "P1059",
          "name": "[NOIP 2006 普及组] 明明的随机数",
          "difficulty": 2
        },
        {
          "pid": "P1200",
          "name": "[USACO1.1] 你的飞碟在这儿 Your Ride Is Here",
          "difficulty": 1
        }
      ]
    },
    {
      "id": "M1-3",
      "mod": "M1",
      "modName": "编程基础与模拟",
      "layer": 0,
      "level": 1,
      "t": "输入输出与文件读写",
      "s": "OI 规范",
      "pre": [
        "M1-1"
      ],
      "problems": [
        {
          "pid": "P1003",
          "name": "[NOIP 2011 提高组] 铺地毯",
          "difficulty": 2
        },
        {
          "pid": "P1000",
          "name": "超级玛丽游戏",
          "difficulty": 1
        },
        {
          "pid": "P1085",
          "name": "[NOIP 2004 普及组] 不高兴的津津",
          "difficulty": 1
        },
        {
          "pid": "P1087",
          "name": "[NOIP 2004 普及组] FBI 树",
          "difficulty": 2
        }
      ]
    },
    {
      "id": "M1-4",
      "mod": "M1",
      "modName": "编程基础与模拟",
      "layer": 1,
      "level": 3,
      "t": "函数与递归",
      "s": "问题分解",
      "pre": [
        "M1-1"
      ],
      "problems": [
        {
          "pid": "P1036",
          "name": "[NOIP 2002 普及组] 选数",
          "difficulty": 2
        },
        {
          "pid": "P1255",
          "name": "数楼梯",
          "difficulty": 2
        },
        {
          "pid": "P1028",
          "name": "[NOIP 2001 普及组] 数的计算",
          "difficulty": 2
        },
        {
          "pid": "P1010",
          "name": "[NOIP 1998 普及组] 幂次方",
          "difficulty": 2
        },
        {
          "pid": "P1464",
          "name": "[PacNW 1999] Function",
          "difficulty": 2
        }
      ]
    },
    {
      "id": "M1-5",
      "mod": "M1",
      "modName": "编程基础与模拟",
      "layer": 1,
      "level": 3,
      "t": "STL 容器与算法库",
      "s": "效率实现",
      "pre": [
        "M1-2"
      ],
      "problems": [
        {
          "pid": "P1059",
          "name": "[NOIP 2006 普及组] 明明的随机数",
          "difficulty": 2
        },
        {
          "pid": "P1449",
          "name": "后缀表达式",
          "difficulty": 2
        },
        {
          "pid": "P1093",
          "name": "[NOIP 2007 普及组] 奖学金",
          "difficulty": 2
        },
        {
          "pid": "P1781",
          "name": "宇宙总统",
          "difficulty": 2
        }
      ]
    },
    {
      "id": "M1-6",
      "mod": "M1",
      "modName": "编程基础与模拟",
      "layer": 1,
      "level": 3,
      "t": "复杂度分析",
      "s": "算法选型",
      "pre": [
        "M1-2"
      ],
      "problems": [
        {
          "pid": "P1309",
          "name": "[NOIP 2011 普及组] 瑞士轮",
          "difficulty": 3
        },
        {
          "pid": "P1083",
          "name": "[NOIP 2012 提高组] 借教室",
          "difficulty": 3
        },
        {
          "pid": "P2672",
          "name": "[NOIP 2015 普及组] 推销员",
          "difficulty": 5
        }
      ]
    },
    {
      "id": "M1-7",
      "mod": "M1",
      "modName": "编程基础与模拟",
      "layer": 1,
      "level": 3,
      "t": "高精度算法",
      "s": "大数运算",
      "pre": [
        "M1-2"
      ],
      "problems": [
        {
          "pid": "P1601",
          "name": "高精度加法",
          "difficulty": 2
        },
        {
          "pid": "P1303",
          "name": "A*B Problem",
          "difficulty": 2
        },
        {
          "pid": "P1005",
          "name": "[NOIP 2007 提高组] 矩阵取数游戏",
          "difficulty": 4
        },
        {
          "pid": "P2142",
          "name": "高精度减法",
          "difficulty": 2
        }
      ]
    },
    {
      "id": "M1-8",
      "mod": "M1",
      "modName": "编程基础与模拟",
      "layer": 2,
      "level": 5,
      "t": "IO 优化与卡常",
      "s": "性能工程",
      "pre": [
        "M1-6"
      ],
      "problems": [
        {
          "pid": "P1908",
          "name": "逆序对",
          "difficulty": 3
        },
        {
          "pid": "P2671",
          "name": "[NOIP 2015 普及组] 求和",
          "difficulty": 4
        },
        {
          "pid": "P1637",
          "name": "三元上升子序列",
          "difficulty": 4
        }
      ]
    },
    {
      "id": "M1-9",
      "mod": "M1",
      "modName": "编程基础与模拟",
      "layer": 2,
      "level": 5,
      "t": "手写容器替代 STL",
      "s": "性能工程",
      "pre": [
        "M1-5",
        "M1-6"
      ],
      "problems": [
        {
          "pid": "P3378",
          "name": "【模板】堆",
          "difficulty": 3
        },
        {
          "pid": "P1886",
          "name": "【模板】单调队列 / 滑动窗口",
          "difficulty": 3
        },
        {
          "pid": "P1090",
          "name": "[NOIP 2004 提高组] 合并果子",
          "difficulty": 3
        }
      ]
    },
    {
      "id": "M2-1",
      "mod": "M2",
      "modName": "排序与贪心",
      "layer": 0,
      "level": 2,
      "t": "基础排序",
      "s": "排序实现",
      "pre": [
        "M1-2"
      ],
      "problems": [
        {
          "pid": "P1177",
          "name": "【模板】排序",
          "difficulty": 2
        },
        {
          "pid": "P1059",
          "name": "[NOIP 2006 普及组] 明明的随机数",
          "difficulty": 2
        },
        {
          "pid": "P1093",
          "name": "[NOIP 2007 普及组] 奖学金",
          "difficulty": 2
        },
        {
          "pid": "P1781",
          "name": "宇宙总统",
          "difficulty": 2
        }
      ]
    },
    {
      "id": "M2-2",
      "mod": "M2",
      "modName": "排序与贪心",
      "layer": 0,
      "level": 2,
      "t": "排序贪心",
      "s": "局部最优",
      "pre": [
        "M2-1"
      ],
      "problems": [
        {
          "pid": "P5019",
          "name": "[NOIP 2018 提高组] 铺设道路",
          "difficulty": 3
        },
        {
          "pid": "P1031",
          "name": "[NOIP 2002 提高组] 均分纸牌",
          "difficulty": 2
        },
        {
          "pid": "P1190",
          "name": "[NOIP 2010 普及组] 接水问题",
          "difficulty": 2
        },
        {
          "pid": "P1106",
          "name": "删数问题",
          "difficulty": 3
        },
        {
          "pid": "P1090",
          "name": "[NOIP 2004 提高组] 合并果子",
          "difficulty": 3
        },
        {
          "pid": "P1208",
          "name": "[USACO1.3] 混合牛奶 Mixing Milk",
          "difficulty": 2
        }
      ]
    },
    {
      "id": "M2-3",
      "mod": "M2",
      "modName": "排序与贪心",
      "layer": 1,
      "level": 4,
      "t": "反悔贪心",
      "s": "堆",
      "pre": [
        "M3-6"
      ],
      "problems": [
        {
          "pid": "P2949",
          "name": "[USACO09OPEN] Work Scheduling G",
          "difficulty": 3
        },
        {
          "pid": "P4053",
          "name": "[JSOI2007] 建筑抢修",
          "difficulty": 5
        },
        {
          "pid": "P1792",
          "name": "[国家集训队] 种树",
          "difficulty": 5
        },
        {
          "pid": "P1484",
          "name": "种树",
          "difficulty": 5
        }
      ]
    },
    {
      "id": "M2-4",
      "mod": "M2",
      "modName": "排序与贪心",
      "layer": 1,
      "level": 4,
      "t": "并查集贪心",
      "s": "Kruskal",
      "pre": [
        "M3-5",
        "M6-1"
      ],
      "problems": [
        {
          "pid": "P3366",
          "name": "【模板】最小生成树",
          "difficulty": 3
        },
        {
          "pid": "P1199",
          "name": "[NOIP 2010 普及组] 三国游戏",
          "difficulty": 3
        },
        {
          "pid": "P1547",
          "name": "[USACO05MAR] Out of Hay S",
          "difficulty": 3
        },
        {
          "pid": "P1111",
          "name": "修复公路",
          "difficulty": 3
        }
      ]
    },
    {
      "id": "M2-5",
      "mod": "M2",
      "modName": "排序与贪心",
      "layer": 1,
      "level": 4,
      "t": "排序+二分贪心",
      "s": "决策单调",
      "pre": [
        "M2-1",
        "M3-4"
      ],
      "problems": [
        {
          "pid": "P2672",
          "name": "[NOIP 2015 普及组] 推销员",
          "difficulty": 5
        },
        {
          "pid": "P1843",
          "name": "奶牛晒衣服",
          "difficulty": 3
        },
        {
          "pid": "P1083",
          "name": "[NOIP 2012 提高组] 借教室",
          "difficulty": 3
        },
        {
          "pid": "P2678",
          "name": "[NOIP 2015 提高组] 跳石头",
          "difficulty": 3
        }
      ]
    },
    {
      "id": "M2-6",
      "mod": "M2",
      "modName": "排序与贪心",
      "layer": 2,
      "level": 6,
      "t": "拟阵与贪心证明",
      "s": "高级贪心",
      "pre": [
        "M2-2",
        "M2-5"
      ],
      "problems": [
        {
          "pid": "P5020",
          "name": "[NOIP 2018 提高组] 货币系统",
          "difficulty": 4
        },
        {
          "pid": "P5659",
          "name": "[CSP-S 2019] 树上的数",
          "difficulty": 8
        },
        {
          "pid": "P1474",
          "name": "[USACO2.3] Money System / [USACO07OCT] Cow Cash G",
          "difficulty": 3
        }
      ]
    },
    {
      "id": "M3-1",
      "mod": "M3",
      "modName": "数据结构",
      "layer": 0,
      "level": 3,
      "t": "数组与 vector",
      "s": "线性存储",
      "pre": [
        "M1-2"
      ],
      "problems": [
        {
          "pid": "P1047",
          "name": "[NOIP 2005 普及组] 校门外的树",
          "difficulty": 1
        },
        {
          "pid": "P3156",
          "name": "【深基15.例1】询问学号",
          "difficulty": 1
        },
        {
          "pid": "P1996",
          "name": "约瑟夫问题",
          "difficulty": 2
        }
      ]
    },
    {
      "id": "M3-2",
      "mod": "M3",
      "modName": "数据结构",
      "layer": 0,
      "level": 3,
      "t": "栈与队列",
      "s": "线性结构",
      "pre": [
        "M1-2"
      ],
      "problems": [
        {
          "pid": "P1449",
          "name": "后缀表达式",
          "difficulty": 2
        },
        {
          "pid": "P1540",
          "name": "[NOIP 2010 提高组] 机器翻译",
          "difficulty": 2
        },
        {
          "pid": "P1733",
          "name": "猜数（IO交互版）",
          "difficulty": 2
        },
        {
          "pid": "P1241",
          "name": "括号序列",
          "difficulty": 2
        }
      ]
    },
    {
      "id": "M3-3",
      "mod": "M3",
      "modName": "数据结构",
      "layer": 0,
      "level": 3,
      "t": "前缀和与差分",
      "s": "静态区间处理",
      "pre": [
        "M1-2"
      ],
      "problems": [
        {
          "pid": "P1115",
          "name": "最大子段和",
          "difficulty": 2
        },
        {
          "pid": "P2004",
          "name": "领地选择",
          "difficulty": 2
        },
        {
          "pid": "P2367",
          "name": "语文成绩",
          "difficulty": 2
        },
        {
          "pid": "P3408",
          "name": "恋爱",
          "difficulty": 4
        },
        {
          "pid": "P4527",
          "name": "[CTSC2008] 奥运抽奖",
          "difficulty": 8
        }
      ]
    },
    {
      "id": "M3-4",
      "mod": "M3",
      "modName": "数据结构",
      "layer": 0,
      "level": 3,
      "t": "二分查找",
      "s": "有序结构",
      "pre": [
        "M2-1"
      ],
      "problems": [
        {
          "pid": "P2249",
          "name": "【深基13.例1】查找",
          "difficulty": 2
        },
        {
          "pid": "P2678",
          "name": "[NOIP 2015 提高组] 跳石头",
          "difficulty": 3
        },
        {
          "pid": "P1024",
          "name": "[NOIP 2001 提高组] 一元三次方程求解",
          "difficulty": 2
        },
        {
          "pid": "P1102",
          "name": "A-B 数对",
          "difficulty": 2
        },
        {
          "pid": "P1873",
          "name": "[COCI 2011/2012 #5] EKO / 砍树",
          "difficulty": 2
        }
      ]
    },
    {
      "id": "M3-5",
      "mod": "M3",
      "modName": "数据结构",
      "layer": 1,
      "level": 5,
      "t": "并查集",
      "s": "集合合并 / 连通",
      "pre": [
        "M1-2"
      ],
      "problems": [
        {
          "pid": "P3367",
          "name": "【模板】并查集",
          "difficulty": 3
        },
        {
          "pid": "P1525",
          "name": "[NOIP 2010 提高组] 关押罪犯",
          "difficulty": 4
        },
        {
          "pid": "P1891",
          "name": "疯狂 LCM",
          "difficulty": 6
        },
        {
          "pid": "P1551",
          "name": "亲戚",
          "difficulty": 3
        },
        {
          "pid": "P2024",
          "name": "[NOI2001] 食物链",
          "difficulty": 4
        }
      ]
    },
    {
      "id": "M3-6",
      "mod": "M3",
      "modName": "数据结构",
      "layer": 1,
      "level": 5,
      "t": "堆与优先队列",
      "s": "动态最值",
      "pre": [
        "M1-2",
        "M2-1"
      ],
      "problems": [
        {
          "pid": "P3378",
          "name": "【模板】堆",
          "difficulty": 3
        },
        {
          "pid": "P1090",
          "name": "[NOIP 2004 提高组] 合并果子",
          "difficulty": 3
        },
        {
          "pid": "P1168",
          "name": "中位数",
          "difficulty": 3
        },
        {
          "pid": "P1631",
          "name": "序列合并",
          "difficulty": 4
        }
      ]
    },
    {
      "id": "M3-7",
      "mod": "M3",
      "modName": "数据结构",
      "layer": 1,
      "level": 5,
      "t": "树状数组",
      "s": "动态前缀和",
      "pre": [
        "M3-3"
      ],
      "problems": [
        {
          "pid": "P3374",
          "name": "【模板】树状数组 1",
          "difficulty": 4
        },
        {
          "pid": "P3368",
          "name": "【模板】树状数组 2",
          "difficulty": 4
        },
        {
          "pid": "P1908",
          "name": "逆序对",
          "difficulty": 3
        },
        {
          "pid": "P3531",
          "name": "[POI 2012] LIT-Letters",
          "difficulty": 3
        }
      ]
    },
    {
      "id": "M3-8",
      "mod": "M3",
      "modName": "数据结构",
      "layer": 1,
      "level": 5,
      "t": "线段树",
      "s": "区间维护",
      "pre": [
        "M3-7"
      ],
      "problems": [
        {
          "pid": "P3372",
          "name": "【模板】线段树 1",
          "difficulty": 4
        },
        {
          "pid": "P3373",
          "name": "【模板】线段树 2",
          "difficulty": 4
        },
        {
          "pid": "P4588",
          "name": "[TJOI2018] 数学计算",
          "difficulty": 4
        },
        {
          "pid": "P1531",
          "name": "I Hate It",
          "difficulty": 4
        }
      ]
    },
    {
      "id": "M3-9",
      "mod": "M3",
      "modName": "数据结构",
      "layer": 1,
      "level": 5,
      "t": "单调栈 / 单调队列",
      "s": "线性优化",
      "pre": [
        "M3-2"
      ],
      "problems": [
        {
          "pid": "P1886",
          "name": "【模板】单调队列 / 滑动窗口",
          "difficulty": 3
        },
        {
          "pid": "P5788",
          "name": "【模板】单调栈",
          "difficulty": 3
        },
        {
          "pid": "P2034",
          "name": "选择数字",
          "difficulty": 4
        }
      ]
    },
    {
      "id": "M3-10",
      "mod": "M3",
      "modName": "数据结构",
      "layer": 1,
      "level": 5,
      "t": "哈希表与 map/set",
      "s": "快速检索",
      "pre": [
        "M1-2"
      ],
      "problems": [
        {
          "pid": "P1102",
          "name": "A-B 数对",
          "difficulty": 2
        },
        {
          "pid": "P5266",
          "name": "【深基17.例6】学籍管理",
          "difficulty": 3
        },
        {
          "pid": "P3370",
          "name": "【模板】字符串哈希",
          "difficulty": 2
        },
        {
          "pid": "P2254",
          "name": "[NOI2005] 瑰丽华尔兹",
          "difficulty": 5
        }
      ]
    },
    {
      "id": "M3-11",
      "mod": "M3",
      "modName": "数据结构",
      "layer": 1,
      "level": 5,
      "t": "ST 表",
      "s": "静态 RMQ",
      "pre": [
        "M1-2"
      ],
      "problems": [
        {
          "pid": "P3865",
          "name": "【模板】ST 表 & RMQ 问题",
          "difficulty": 3
        },
        {
          "pid": "P2880",
          "name": "[USACO07JAN] Balanced Lineup G",
          "difficulty": 3
        },
        {
          "pid": "P2048",
          "name": "[NOI2010] 超级钢琴",
          "difficulty": 7
        }
      ]
    },
    {
      "id": "M3-12",
      "mod": "M3",
      "modName": "数据结构",
      "layer": 2,
      "level": 7,
      "t": "平衡树（Treap/Splay/FHQ）",
      "s": "动态有序集",
      "pre": [
        "M3-8"
      ],
      "problems": [
        {
          "pid": "P3369",
          "name": "【模板】普通平衡树",
          "difficulty": 6
        },
        {
          "pid": "P3391",
          "name": "【模板】文艺平衡树",
          "difficulty": 6
        },
        {
          "pid": "P2234",
          "name": "[HNOI2002] 营业额统计",
          "difficulty": 2
        },
        {
          "pid": "P1483",
          "name": "序列变换",
          "difficulty": 4
        }
      ]
    },
    {
      "id": "M3-13",
      "mod": "M3",
      "modName": "数据结构",
      "layer": 2,
      "level": 7,
      "t": "可持久化数据结构",
      "s": "历史版本",
      "pre": [
        "M3-8",
        "M3-12"
      ],
      "problems": [
        {
          "pid": "P3919",
          "name": "【模板】可持久化线段树 1（可持久化数组）",
          "difficulty": 6
        },
        {
          "pid": "P3834",
          "name": "【模板】可持久化线段树 2（静态区间第 k 小）",
          "difficulty": 6
        },
        {
          "pid": "P3521",
          "name": "[POI 2011] ROT-Tree Rotations",
          "difficulty": 6
        },
        {
          "pid": "P3402",
          "name": "【模板】可持久化并查集",
          "difficulty": 6
        }
      ]
    },
    {
      "id": "M3-14",
      "mod": "M3",
      "modName": "数据结构",
      "layer": 2,
      "level": 7,
      "t": "树链剖分",
      "s": "树上路径",
      "pre": [
        "M4-1",
        "M6-1",
        "M3-8"
      ],
      "problems": [
        {
          "pid": "P3384",
          "name": "【模板】重链剖分 / 树链剖分",
          "difficulty": 6
        },
        {
          "pid": "P2590",
          "name": "[ZJOI2008] 树的统计",
          "difficulty": 6
        },
        {
          "pid": "P2146",
          "name": "[NOI2015] 软件包管理器",
          "difficulty": 6
        },
        {
          "pid": "P4114",
          "name": "Qtree1",
          "difficulty": 6
        }
      ]
    },
    {
      "id": "M3-15",
      "mod": "M3",
      "modName": "数据结构",
      "layer": 2,
      "level": 7,
      "t": "线段树合并 / 分治",
      "s": "CDQ / 点分治",
      "pre": [
        "M3-8"
      ],
      "problems": [
        {
          "pid": "P3810",
          "name": "【模板】三维偏序 / 陌上花开",
          "difficulty": 6
        },
        {
          "pid": "P3806",
          "name": "【模板】点分治",
          "difficulty": 6
        },
        {
          "pid": "P4556",
          "name": "【模板】线段树合并 / [Vani 有约会] 雨天的尾巴",
          "difficulty": 6
        },
        {
          "pid": "P3204",
          "name": "[HNOI2010] 公交线路",
          "difficulty": 7
        }
      ]
    },
    {
      "id": "M4-1",
      "mod": "M4",
      "modName": "搜索与枚举",
      "layer": 0,
      "level": 4,
      "t": "DFS",
      "s": "回溯枚举",
      "pre": [
        "M1-4"
      ],
      "problems": [
        {
          "pid": "P1219",
          "name": "[USACO1.5] 八皇后 Checker Challenge",
          "difficulty": 3
        },
        {
          "pid": "P1706",
          "name": "全排列问题",
          "difficulty": 2
        },
        {
          "pid": "P1036",
          "name": "[NOIP 2002 普及组] 选数",
          "difficulty": 2
        },
        {
          "pid": "P1085",
          "name": "[NOIP 2004 普及组] 不高兴的津津",
          "difficulty": 1
        },
        {
          "pid": "P1215",
          "name": "[USACO1.4] 母亲的牛奶 Mother's Milk",
          "difficulty": 3
        }
      ]
    },
    {
      "id": "M4-2",
      "mod": "M4",
      "modName": "搜索与枚举",
      "layer": 0,
      "level": 4,
      "t": "BFS",
      "s": "无权最短路",
      "pre": [
        "M3-2"
      ],
      "problems": [
        {
          "pid": "P1443",
          "name": "马的遍历",
          "difficulty": 2
        },
        {
          "pid": "P1162",
          "name": "填涂颜色",
          "difficulty": 2
        },
        {
          "pid": "P1746",
          "name": "离开中山路",
          "difficulty": 2
        },
        {
          "pid": "P1131",
          "name": "[ZJOI2007] 时态同步",
          "difficulty": 4
        }
      ]
    },
    {
      "id": "M4-3",
      "mod": "M4",
      "modName": "搜索与枚举",
      "layer": 0,
      "level": 4,
      "t": "枚举与子集枚举",
      "s": "暴力",
      "pre": [
        "M1-2"
      ],
      "problems": [
        {
          "pid": "P1217",
          "name": "[USACO1.5] 回文质数 Prime Palindromes",
          "difficulty": 2
        },
        {
          "pid": "P3654",
          "name": "First Step (ファーストステップ)",
          "difficulty": 2
        },
        {
          "pid": "P1036",
          "name": "[NOIP 2002 普及组] 选数",
          "difficulty": 2
        },
        {
          "pid": "P1102",
          "name": "A-B 数对",
          "difficulty": 2
        }
      ]
    },
    {
      "id": "M4-4",
      "mod": "M4",
      "modName": "搜索与枚举",
      "layer": 1,
      "level": 6,
      "t": "剪枝与最优性剪枝",
      "s": "搜索优化",
      "pre": [
        "M4-1"
      ],
      "problems": [
        {
          "pid": "P1731",
          "name": "[NOI1999] 生日蛋糕",
          "difficulty": 4
        },
        {
          "pid": "P1120",
          "name": "[CERC 1995] 小木棍",
          "difficulty": 5
        },
        {
          "pid": "P1461",
          "name": "[USACO2.1] 海明码 Hamming Codes",
          "difficulty": 3
        },
        {
          "pid": "P1019",
          "name": "[NOIP 2000 提高组] 单词接龙（疑似错题）",
          "difficulty": 3
        }
      ]
    },
    {
      "id": "M4-5",
      "mod": "M4",
      "modName": "搜索与枚举",
      "layer": 1,
      "level": 6,
      "t": "记忆化搜索",
      "s": "自顶向下",
      "pre": [
        "M4-1"
      ],
      "problems": [
        {
          "pid": "P1434",
          "name": "[SHOI2002] 滑雪",
          "difficulty": 3
        },
        {
          "pid": "P1048",
          "name": "[NOIP 2005 普及组] 采药",
          "difficulty": 2
        },
        {
          "pid": "P1118",
          "name": "[USACO06FEB] Backward Digit Sums G/S",
          "difficulty": 3
        },
        {
          "pid": "P1387",
          "name": "最大正方形",
          "difficulty": 2
        }
      ]
    },
    {
      "id": "M4-6",
      "mod": "M4",
      "modName": "搜索与枚举",
      "layer": 1,
      "level": 6,
      "t": "双向 BFS 与迭代加深",
      "s": "搜索策略",
      "pre": [
        "M4-2"
      ],
      "problems": [
        {
          "pid": "P1379",
          "name": "八数码难题",
          "difficulty": 4
        },
        {
          "pid": "P2324",
          "name": "[SCOI2005] 骑士精神",
          "difficulty": 5
        },
        {
          "pid": "P2730",
          "name": "[IOI 1996 / USACO3.2] 魔板 Magic Squares",
          "difficulty": 4
        },
        {
          "pid": "P1213",
          "name": "[IOI 1994 / USACO1.4] 时钟 The Clocks",
          "difficulty": 4
        }
      ]
    },
    {
      "id": "M4-7",
      "mod": "M4",
      "modName": "搜索与枚举",
      "layer": 1,
      "level": 6,
      "t": "状态压缩搜索",
      "s": "位运算",
      "pre": [
        "M7-1",
        "M4-1"
      ],
      "problems": [
        {
          "pid": "P2622",
          "name": "关灯问题 II",
          "difficulty": 3
        },
        {
          "pid": "P1433",
          "name": "吃奶酪",
          "difficulty": 4
        },
        {
          "pid": "P1896",
          "name": "[SCOI2005] 互不侵犯",
          "difficulty": 5
        },
        {
          "pid": "P3052",
          "name": "[USACO12MAR] Cows in a Skyscraper G",
          "difficulty": 3
        }
      ]
    },
    {
      "id": "M4-8",
      "mod": "M4",
      "modName": "搜索与枚举",
      "layer": 2,
      "level": 8,
      "t": "Dancing Links / A*",
      "s": "高级搜索",
      "pre": [
        "M4-4"
      ],
      "problems": [
        {
          "pid": "P1784",
          "name": "数独",
          "difficulty": 3
        },
        {
          "pid": "P1379",
          "name": "八数码难题",
          "difficulty": 4
        },
        {
          "pid": "P1799",
          "name": "数列",
          "difficulty": 4
        }
      ]
    },
    {
      "id": "M5-1",
      "mod": "M5",
      "modName": "动态规划",
      "layer": 0,
      "level": 5,
      "t": "递推",
      "s": "DP 初识",
      "pre": [
        "M1-4"
      ],
      "problems": [
        {
          "pid": "P1255",
          "name": "数楼梯",
          "difficulty": 2
        },
        {
          "pid": "P2437",
          "name": "蜜蜂路线",
          "difficulty": 2
        },
        {
          "pid": "P1990",
          "name": "覆盖墙壁",
          "difficulty": 3
        },
        {
          "pid": "P1028",
          "name": "[NOIP 2001 普及组] 数的计算",
          "difficulty": 2
        }
      ]
    },
    {
      "id": "M5-2",
      "mod": "M5",
      "modName": "动态规划",
      "layer": 0,
      "level": 5,
      "t": "线性DP",
      "s": "序列问题",
      "pre": [
        "M5-1"
      ],
      "problems": [
        {
          "pid": "P1216",
          "name": "[IOI 1994 / USACO1.5] 数字三角形 Number Triangles",
          "difficulty": 2
        },
        {
          "pid": "P1091",
          "name": "[NOIP 2004 提高组] 合唱队形",
          "difficulty": 2
        },
        {
          "pid": "P1115",
          "name": "最大子段和",
          "difficulty": 2
        },
        {
          "pid": "P2285",
          "name": "[HNOI2004] 打鼹鼠",
          "difficulty": 3
        },
        {
          "pid": "P1280",
          "name": "[CHCI 2002 National Competition #2 Juniors] 尼克的任务",
          "difficulty": 3
        }
      ]
    },
    {
      "id": "M5-3",
      "mod": "M5",
      "modName": "动态规划",
      "layer": 0,
      "level": 5,
      "t": "LIS / LCS",
      "s": "基础状态设计",
      "pre": [
        "M5-2"
      ],
      "problems": [
        {
          "pid": "P1020",
          "name": "[NOIP 1999 提高组] 导弹拦截",
          "difficulty": 4
        },
        {
          "pid": "P1439",
          "name": "两个排列的最长公共子序列",
          "difficulty": 4
        },
        {
          "pid": "P2758",
          "name": "编辑距离",
          "difficulty": 3
        },
        {
          "pid": "P1970",
          "name": "[NOIP 2013 提高组] 花匠",
          "difficulty": 3
        }
      ]
    },
    {
      "id": "M5-4",
      "mod": "M5",
      "modName": "动态规划",
      "layer": 1,
      "level": 7,
      "t": "背包DP",
      "s": "01/完全/多重/分组/依赖",
      "pre": [
        "M5-2"
      ],
      "problems": [
        {
          "pid": "P1048",
          "name": "[NOIP 2005 普及组] 采药",
          "difficulty": 2
        },
        {
          "pid": "P1616",
          "name": "疯狂的采药",
          "difficulty": 2
        },
        {
          "pid": "P1757",
          "name": "通天之分组背包",
          "difficulty": 2
        },
        {
          "pid": "P1064",
          "name": "[NOIP 2006 提高组] 金明的预算方案",
          "difficulty": 4
        },
        {
          "pid": "P1049",
          "name": "[NOIP 2001 普及组] 装箱问题",
          "difficulty": 2
        },
        {
          "pid": "P1060",
          "name": "[NOIP 2006 普及组] 开心的金明",
          "difficulty": 2
        }
      ]
    },
    {
      "id": "M5-5",
      "mod": "M5",
      "modName": "动态规划",
      "layer": 1,
      "level": 7,
      "t": "区间DP",
      "s": "区间合并",
      "pre": [
        "M5-2"
      ],
      "problems": [
        {
          "pid": "P1880",
          "name": "[NOI1995] 石子合并",
          "difficulty": 4
        },
        {
          "pid": "P1063",
          "name": "[NOIP 2006 提高组] 能量项链",
          "difficulty": 4
        },
        {
          "pid": "P1435",
          "name": "[IOI 2000] 回文字串",
          "difficulty": 3
        },
        {
          "pid": "P3205",
          "name": "[HNOI2010] 合唱队",
          "difficulty": 4
        }
      ]
    },
    {
      "id": "M5-6",
      "mod": "M5",
      "modName": "动态规划",
      "layer": 1,
      "level": 7,
      "t": "树形DP",
      "s": "树上决策",
      "pre": [
        "M4-1",
        "M6-1"
      ],
      "problems": [
        {
          "pid": "P1352",
          "name": "没有上司的舞会",
          "difficulty": 3
        },
        {
          "pid": "P2014",
          "name": "[CTSC1997] 选课",
          "difficulty": 4
        },
        {
          "pid": "P2016",
          "name": "[SEERC 2000] 战略游戏",
          "difficulty": 3
        },
        {
          "pid": "P2515",
          "name": "[HAOI2010] 软件安装",
          "difficulty": 5
        }
      ]
    },
    {
      "id": "M5-7",
      "mod": "M5",
      "modName": "动态规划",
      "layer": 1,
      "level": 7,
      "t": "状压DP",
      "s": "位运算状态",
      "pre": [
        "M7-1",
        "M5-2"
      ],
      "problems": [
        {
          "pid": "P1896",
          "name": "[SCOI2005] 互不侵犯",
          "difficulty": 5
        },
        {
          "pid": "P1879",
          "name": "[USACO06NOV] Corn Fields G",
          "difficulty": 4
        },
        {
          "pid": "P1433",
          "name": "吃奶酪",
          "difficulty": 4
        },
        {
          "pid": "P3959",
          "name": "[NOIP 2017 提高组] 宝藏",
          "difficulty": 7
        }
      ]
    },
    {
      "id": "M5-8",
      "mod": "M5",
      "modName": "动态规划",
      "layer": 1,
      "level": 7,
      "t": "计数 / 多维DP",
      "s": "方案统计",
      "pre": [
        "M5-2"
      ],
      "problems": [
        {
          "pid": "P1004",
          "name": "[NOIP 2000 提高组] 方格取数",
          "difficulty": 4
        },
        {
          "pid": "P1006",
          "name": "[NOIP 2008 提高组] 传纸条",
          "difficulty": 4
        },
        {
          "pid": "P1057",
          "name": "[NOIP 2008 普及组] 传球游戏",
          "difficulty": 3
        },
        {
          "pid": "P1077",
          "name": "[NOIP 2012 普及组] 摆花",
          "difficulty": 2
        },
        {
          "pid": "P1387",
          "name": "最大正方形",
          "difficulty": 2
        }
      ]
    },
    {
      "id": "M5-9",
      "mod": "M5",
      "modName": "动态规划",
      "layer": 2,
      "level": 9,
      "t": "数位DP",
      "s": "数位统计",
      "pre": [
        "M5-2",
        "M4-5"
      ],
      "problems": [
        {
          "pid": "P2657",
          "name": "[SCOI2009] windy 数",
          "difficulty": 3
        },
        {
          "pid": "P2602",
          "name": "[ZJOI2010] 数字计数",
          "difficulty": 4
        },
        {
          "pid": "P4124",
          "name": "[CQOI2016] 手机号码",
          "difficulty": 5
        },
        {
          "pid": "P3413",
          "name": "SAC#1 - 萌数",
          "difficulty": 6
        }
      ]
    },
    {
      "id": "M5-10",
      "mod": "M5",
      "modName": "动态规划",
      "layer": 2,
      "level": 9,
      "t": "DP优化",
      "s": "单调队列 / 斜率 / 四边形",
      "pre": [
        "M3-9",
        "M5-2"
      ],
      "problems": [
        {
          "pid": "P1725",
          "name": "琪露诺",
          "difficulty": 4
        },
        {
          "pid": "P2120",
          "name": "[ZJOI2007] 仓库建设",
          "difficulty": 6
        },
        {
          "pid": "P5017",
          "name": "[NOIP 2018 普及组] 摆渡车",
          "difficulty": 5
        },
        {
          "pid": "P3195",
          "name": "[HNOI2008] 玩具装箱",
          "difficulty": 6
        }
      ]
    },
    {
      "id": "M5-11",
      "mod": "M5",
      "modName": "动态规划",
      "layer": 2,
      "level": 9,
      "t": "插头DP / DP套DP",
      "s": "高阶",
      "pre": [
        "M5-7"
      ],
      "problems": [
        {
          "pid": "P5056",
          "name": "【模板】插头 DP",
          "difficulty": 8
        },
        {
          "pid": "P5074",
          "name": "Eat the Trees",
          "difficulty": 7
        },
        {
          "pid": "P3190",
          "name": "[HNOI2007] 神奇游乐园",
          "difficulty": 8
        },
        {
          "pid": "P3886",
          "name": "[JLOI2009] 神秘的生物",
          "difficulty": 7
        }
      ]
    },
    {
      "id": "M6-1",
      "mod": "M6",
      "modName": "图论",
      "layer": 0,
      "level": 6,
      "t": "图存储与遍历",
      "s": "连通性",
      "pre": [
        "M4-1",
        "M4-2"
      ],
      "problems": [
        {
          "pid": "P5318",
          "name": "【深基18.例3】查找文献",
          "difficulty": 2
        },
        {
          "pid": "P1596",
          "name": "[USACO10OCT] Lake Counting S",
          "difficulty": 2
        },
        {
          "pid": "P1443",
          "name": "马的遍历",
          "difficulty": 2
        },
        {
          "pid": "P1162",
          "name": "填涂颜色",
          "difficulty": 2
        }
      ]
    },
    {
      "id": "M6-2",
      "mod": "M6",
      "modName": "图论",
      "layer": 0,
      "level": 6,
      "t": "拓扑排序",
      "s": "DAG 处理",
      "pre": [
        "M6-1"
      ],
      "problems": [
        {
          "pid": "P1113",
          "name": "[USACO02FEB] 杂务",
          "difficulty": 3
        },
        {
          "pid": "P1347",
          "name": "[ECNA 2001] 排序",
          "difficulty": 4
        },
        {
          "pid": "P4017",
          "name": "最大食物链计数",
          "difficulty": 3
        }
      ]
    },
    {
      "id": "M6-3",
      "mod": "M6",
      "modName": "图论",
      "layer": 1,
      "level": 8,
      "t": "最短路",
      "s": "Dijkstra / SPFA",
      "pre": [
        "M6-1",
        "M3-6"
      ],
      "problems": [
        {
          "pid": "P4779",
          "name": "【模板】单源最短路径（标准版）",
          "difficulty": 3
        },
        {
          "pid": "P3371",
          "name": "【模板】单源最短路径（弱化版）",
          "difficulty": 3
        },
        {
          "pid": "P1629",
          "name": "邮递员送信",
          "difficulty": 3
        },
        {
          "pid": "P1144",
          "name": "最短路计数",
          "difficulty": 4
        }
      ]
    },
    {
      "id": "M6-4",
      "mod": "M6",
      "modName": "图论",
      "layer": 1,
      "level": 8,
      "t": "Floyd 多源最短路",
      "s": "任意两点",
      "pre": [
        "M6-1"
      ],
      "problems": [
        {
          "pid": "P2910",
          "name": "[USACO08OPEN] Clear And Present Danger S",
          "difficulty": 3
        },
        {
          "pid": "P1119",
          "name": "灾后重建",
          "difficulty": 4
        },
        {
          "pid": "P2419",
          "name": "[USACO08JAN] Cow Contest S",
          "difficulty": 3
        }
      ]
    },
    {
      "id": "M6-5",
      "mod": "M6",
      "modName": "图论",
      "layer": 1,
      "level": 8,
      "t": "最小生成树",
      "s": "连通代价",
      "pre": [
        "M6-1",
        "M3-5"
      ],
      "problems": [
        {
          "pid": "P3366",
          "name": "【模板】最小生成树",
          "difficulty": 3
        },
        {
          "pid": "P1546",
          "name": "[USACO3.1] 最短网络 Agri-Net",
          "difficulty": 3
        },
        {
          "pid": "P1396",
          "name": "营救",
          "difficulty": 3
        },
        {
          "pid": "P2330",
          "name": "[SCOI2005] 繁忙的都市",
          "difficulty": 3
        }
      ]
    },
    {
      "id": "M6-6",
      "mod": "M6",
      "modName": "图论",
      "layer": 1,
      "level": 8,
      "t": "二分图判定与匈牙利",
      "s": "匹配",
      "pre": [
        "M6-1"
      ],
      "problems": [
        {
          "pid": "P3386",
          "name": "【模板】二分图最大匹配",
          "difficulty": 4
        },
        {
          "pid": "P1330",
          "name": "封锁阳光大学",
          "difficulty": 3
        },
        {
          "pid": "P1525",
          "name": "[NOIP 2010 提高组] 关押罪犯",
          "difficulty": 4
        },
        {
          "pid": "P1892",
          "name": "[BalticOI 2003] 团伙 (Day 2)",
          "difficulty": 4
        }
      ]
    },
    {
      "id": "M6-7",
      "mod": "M6",
      "modName": "图论",
      "layer": 1,
      "level": 8,
      "t": "欧拉 / 哈密顿路",
      "s": "一笔画",
      "pre": [
        "M6-1"
      ],
      "problems": [
        {
          "pid": "P1341",
          "name": "无序字母对",
          "difficulty": 4
        },
        {
          "pid": "P7771",
          "name": "【模板】欧拉路径",
          "difficulty": 4
        },
        {
          "pid": "P2731",
          "name": "[USACO3.3] 骑马修栅栏 Riding the Fences",
          "difficulty": 4
        },
        {
          "pid": "P3520",
          "name": "[POI 2011] SMI-Garbage",
          "difficulty": 4
        }
      ]
    },
    {
      "id": "M6-8",
      "mod": "M6",
      "modName": "图论",
      "layer": 2,
      "level": 10,
      "t": "强连通分量与缩点",
      "s": "有向图",
      "pre": [
        "M6-1",
        "M6-2"
      ],
      "problems": [
        {
          "pid": "P3387",
          "name": "【模板】缩点 / 强连通分量",
          "difficulty": 4
        },
        {
          "pid": "P2812",
          "name": "校园网络 / [IOI 1996 / USACO5.3] 校园网 Network of Schools 加强版",
          "difficulty": 5
        },
        {
          "pid": "P2341",
          "name": "[USACO03FALL / HAOI2006] 受欢迎的牛 G",
          "difficulty": 4
        },
        {
          "pid": "P2002",
          "name": "消息扩散",
          "difficulty": 4
        }
      ]
    },
    {
      "id": "M6-9",
      "mod": "M6",
      "modName": "图论",
      "layer": 2,
      "level": 10,
      "t": "割点 / 桥与双连通",
      "s": "连通度",
      "pre": [
        "M6-1"
      ],
      "problems": [
        {
          "pid": "P3388",
          "name": "【模板】割点",
          "difficulty": 4
        },
        {
          "pid": "P3469",
          "name": "[POI 2008] BLO-Blockade",
          "difficulty": 5
        },
        {
          "pid": "P1656",
          "name": "炸铁路",
          "difficulty": 3
        },
        {
          "pid": "P8436",
          "name": "【模板】边双连通分量",
          "difficulty": 4
        }
      ]
    },
    {
      "id": "M6-10",
      "mod": "M6",
      "modName": "图论",
      "layer": 2,
      "level": 10,
      "t": "网络流",
      "s": "最大流 / 费用流",
      "pre": [
        "M6-1",
        "M6-3"
      ],
      "problems": [
        {
          "pid": "P3376",
          "name": "【模板】网络最大流",
          "difficulty": 6
        },
        {
          "pid": "P3381",
          "name": "【模板】最小费用最大流",
          "difficulty": 6
        },
        {
          "pid": "P1402",
          "name": "酒店之王",
          "difficulty": 7
        },
        {
          "pid": "P1231",
          "name": "教辅的组成",
          "difficulty": 7
        }
      ]
    },
    {
      "id": "M6-11",
      "mod": "M6",
      "modName": "图论",
      "layer": 2,
      "level": 10,
      "t": "2-SAT 与差分约束",
      "s": "约束建模",
      "pre": [
        "M6-8",
        "M6-3"
      ],
      "problems": [
        {
          "pid": "P4782",
          "name": "【模板】2-SAT",
          "difficulty": 5
        },
        {
          "pid": "P5960",
          "name": "【模板】差分约束",
          "difficulty": 4
        },
        {
          "pid": "P3825",
          "name": "[NOI2017] 游戏",
          "difficulty": 6
        },
        {
          "pid": "P5656",
          "name": "【模板】二元一次不定方程 (exgcd)",
          "difficulty": 5
        }
      ]
    },
    {
      "id": "M7-1",
      "mod": "M7",
      "modName": "数学与数论",
      "layer": 0,
      "level": 7,
      "t": "进制转换与位运算",
      "s": "二进制",
      "pre": [
        "M1-1"
      ],
      "problems": [
        {
          "pid": "P1100",
          "name": "高低位交换",
          "difficulty": 2
        },
        {
          "pid": "P1143",
          "name": "进制转换",
          "difficulty": 2
        },
        {
          "pid": "P1017",
          "name": "[NOIP 2000 提高组] 进制转换",
          "difficulty": 2
        },
        {
          "pid": "P2114",
          "name": "[NOI2014] 起床困难综合症",
          "difficulty": 4
        }
      ]
    },
    {
      "id": "M7-2",
      "mod": "M7",
      "modName": "数学与数论",
      "layer": 0,
      "level": 7,
      "t": "质数与筛法",
      "s": "整数性质",
      "pre": [
        "M1-2"
      ],
      "problems": [
        {
          "pid": "P3383",
          "name": "【模板】线性筛素数",
          "difficulty": 2
        },
        {
          "pid": "P1835",
          "name": "素数密度",
          "difficulty": 3
        },
        {
          "pid": "P1075",
          "name": "[NOIP 2012 普及组] 质因数分解",
          "difficulty": 2
        },
        {
          "pid": "P3989",
          "name": "[SHOI2013] 阶乘字符串",
          "difficulty": 7
        }
      ]
    },
    {
      "id": "M7-3",
      "mod": "M7",
      "modName": "数学与数论",
      "layer": 0,
      "level": 7,
      "t": "gcd/lcm 与快速幂",
      "s": "数论基础",
      "pre": [
        "M1-1"
      ],
      "problems": [
        {
          "pid": "P1226",
          "name": "【模板】快速幂",
          "difficulty": 2
        },
        {
          "pid": "P1029",
          "name": "[NOIP 2001 普及组] 最大公约数和最小公倍数问题",
          "difficulty": 2
        },
        {
          "pid": "P1072",
          "name": "[NOIP 2009 提高组] Hankson 的趣味题",
          "difficulty": 2
        },
        {
          "pid": "P1080",
          "name": "[NOIP 2012 提高组] 国王游戏",
          "difficulty": 5
        }
      ]
    },
    {
      "id": "M7-4",
      "mod": "M7",
      "modName": "数学与数论",
      "layer": 1,
      "level": 9,
      "t": "欧拉函数与扩展欧几里得",
      "s": "数论",
      "pre": [
        "M7-2",
        "M7-3"
      ],
      "problems": [
        {
          "pid": "P1082",
          "name": "[NOIP 2012 提高组] 同余方程",
          "difficulty": 4
        },
        {
          "pid": "P2158",
          "name": "[SDOI2008] 仪仗队",
          "difficulty": 5
        },
        {
          "pid": "P2155",
          "name": "[SDOI2008] 沙拉公主的困惑",
          "difficulty": 6
        },
        {
          "pid": "P1170",
          "name": "兔八哥与猎人",
          "difficulty": 2
        }
      ]
    },
    {
      "id": "M7-5",
      "mod": "M7",
      "modName": "数学与数论",
      "layer": 1,
      "level": 9,
      "t": "乘法逆元与组合数",
      "s": "模运算",
      "pre": [
        "M7-4"
      ],
      "problems": [
        {
          "pid": "P3811",
          "name": "【模板】模意义下的乘法逆元",
          "difficulty": 3
        },
        {
          "pid": "P2822",
          "name": "[NOIP 2016 提高组] 组合数问题",
          "difficulty": 3
        },
        {
          "pid": "P3807",
          "name": "【模板】卢卡斯定理 / Lucas 定理",
          "difficulty": 5
        },
        {
          "pid": "P3907",
          "name": "环的异或",
          "difficulty": 5
        }
      ]
    },
    {
      "id": "M7-6",
      "mod": "M7",
      "modName": "数学与数论",
      "layer": 1,
      "level": 9,
      "t": "中国剩余定理",
      "s": "同余方程组",
      "pre": [
        "M7-4"
      ],
      "problems": [
        {
          "pid": "P1495",
          "name": "【模板】中国剩余定理（CRT）/ 曹冲养猪",
          "difficulty": 5
        },
        {
          "pid": "P4777",
          "name": "【模板】扩展中国剩余定理（EXCRT）",
          "difficulty": 5
        },
        {
          "pid": "P2429",
          "name": "制杖题",
          "difficulty": 4
        },
        {
          "pid": "P4778",
          "name": "Counting swaps",
          "difficulty": 7
        }
      ]
    },
    {
      "id": "M7-7",
      "mod": "M7",
      "modName": "数学与数论",
      "layer": 1,
      "level": 9,
      "t": "矩阵快速幂",
      "s": "递推加速",
      "pre": [
        "M7-3",
        "M5-2"
      ],
      "problems": [
        {
          "pid": "P1962",
          "name": "斐波那契数列",
          "difficulty": 4
        },
        {
          "pid": "P1939",
          "name": "矩阵加速（数列）",
          "difficulty": 4
        },
        {
          "pid": "P3390",
          "name": "【模板】矩阵快速幂",
          "difficulty": 4
        },
        {
          "pid": "P2266",
          "name": "爱的供养",
          "difficulty": 5
        }
      ]
    },
    {
      "id": "M7-8",
      "mod": "M7",
      "modName": "数学与数论",
      "layer": 1,
      "level": 9,
      "t": "概率与期望DP",
      "s": "期望",
      "pre": [
        "M5-2"
      ],
      "problems": [
        {
          "pid": "P4316",
          "name": "绿豆蛙的归宿",
          "difficulty": 4
        },
        {
          "pid": "P1850",
          "name": "[NOIP 2016 提高组] 换教室",
          "difficulty": 5
        },
        {
          "pid": "P1654",
          "name": "OSU!",
          "difficulty": 5
        },
        {
          "pid": "P1365",
          "name": "WJMZBMR打osu! / Easy",
          "difficulty": 4
        }
      ]
    },
    {
      "id": "M7-9",
      "mod": "M7",
      "modName": "数学与数论",
      "layer": 1,
      "level": 9,
      "t": "组合数学与容斥原理",
      "s": "计数",
      "pre": [
        "M7-5"
      ],
      "problems": [
        {
          "pid": "P3417",
          "name": "[POI 2005] BANK-Cash Dispenser",
          "difficulty": 5
        },
        {
          "pid": "P2567",
          "name": "[SCOI2010] 幸运数字",
          "difficulty": 5
        },
        {
          "pid": "P3313",
          "name": "[SDOI2014] 旅行",
          "difficulty": 6
        },
        {
          "pid": "P1450",
          "name": "[HAOI2008] 硬币购物",
          "difficulty": 5
        }
      ]
    },
    {
      "id": "M7-10",
      "mod": "M7",
      "modName": "数学与数论",
      "layer": 2,
      "level": 10,
      "t": "莫比乌斯反演与杜教筛",
      "s": "积性函数",
      "pre": [
        "M7-5"
      ],
      "problems": [
        {
          "pid": "P3455",
          "name": "[POI 2007] ZAP-Queries",
          "difficulty": 6
        },
        {
          "pid": "P3327",
          "name": "[SDOI2015] 约数个数和",
          "difficulty": 7
        },
        {
          "pid": "P2257",
          "name": "YY的GCD",
          "difficulty": 6
        },
        {
          "pid": "P4317",
          "name": "花神的数论题",
          "difficulty": 5
        }
      ]
    },
    {
      "id": "M7-11",
      "mod": "M7",
      "modName": "数学与数论",
      "layer": 2,
      "level": 10,
      "t": "高斯消元与线性基",
      "s": "线性代数",
      "pre": [
        "M7-7",
        "M7-1"
      ],
      "problems": [
        {
          "pid": "P3389",
          "name": "【模板】高斯消元法",
          "difficulty": 5
        },
        {
          "pid": "P3812",
          "name": "【模板】线性基",
          "difficulty": 5
        },
        {
          "pid": "P2447",
          "name": "[SDOI2010] 外星千足虫",
          "difficulty": 5
        },
        {
          "pid": "P3264",
          "name": "[JLOI2015] 管道连接",
          "difficulty": 7
        }
      ]
    },
    {
      "id": "M7-12",
      "mod": "M7",
      "modName": "数学与数论",
      "layer": 2,
      "level": 10,
      "t": "Polya / 伯恩赛德",
      "s": "置换群",
      "pre": [
        "M7-9"
      ],
      "problems": [
        {
          "pid": "P4980",
          "name": "【模板】Pólya（Polya）定理",
          "difficulty": 7
        },
        {
          "pid": "P1446",
          "name": "[HNOI2008] Cards",
          "difficulty": 7
        },
        {
          "pid": "P2566",
          "name": "[SCOI2009] 围豆豆",
          "difficulty": 7
        },
        {
          "pid": "P4916",
          "name": "[MtOI2018] 魔力环",
          "difficulty": 8
        }
      ]
    },
    {
      "id": "M8-1",
      "mod": "M8",
      "modName": "字符串与其他",
      "layer": 0,
      "level": 8,
      "t": "字符串基础与字符统计",
      "s": "字符处理",
      "pre": [
        "M1-1"
      ],
      "problems": [
        {
          "pid": "P1308",
          "name": "[NOIP 2011 普及组] 统计单词数",
          "difficulty": 2
        },
        {
          "pid": "P1553",
          "name": "数字反转（升级版）",
          "difficulty": 2
        },
        {
          "pid": "P1042",
          "name": "[NOIP 2003 普及组] 乒乓球",
          "difficulty": 2
        },
        {
          "pid": "P1200",
          "name": "[USACO1.1] 你的飞碟在这儿 Your Ride Is Here",
          "difficulty": 1
        }
      ]
    },
    {
      "id": "M8-2",
      "mod": "M8",
      "modName": "字符串与其他",
      "layer": 1,
      "level": 10,
      "t": "字符串哈希",
      "s": "快速判等",
      "pre": [
        "M8-1"
      ],
      "problems": [
        {
          "pid": "P3370",
          "name": "【模板】字符串哈希",
          "difficulty": 2
        },
        {
          "pid": "P2852",
          "name": "[USACO06DEC] Milk Patterns G",
          "difficulty": 4
        },
        {
          "pid": "P4391",
          "name": "[BalticOI 2009] Radio Transmission 无线传输",
          "difficulty": 4
        },
        {
          "pid": "P3527",
          "name": "[POI 2011] MET-Meteors",
          "difficulty": 7
        }
      ]
    },
    {
      "id": "M8-3",
      "mod": "M8",
      "modName": "字符串与其他",
      "layer": 1,
      "level": 10,
      "t": "KMP 与 Z 函数",
      "s": "模式匹配",
      "pre": [
        "M8-1"
      ],
      "problems": [
        {
          "pid": "P3375",
          "name": "【模板】KMP",
          "difficulty": 4
        },
        {
          "pid": "P5410",
          "name": "【模板】扩展 KMP / exKMP（Z 函数）",
          "difficulty": 6
        },
        {
          "pid": "P4884",
          "name": "多少个 1？",
          "difficulty": 5
        },
        {
          "pid": "P3435",
          "name": "[POI 2006] OKR-Periods of Words",
          "difficulty": 5
        }
      ]
    },
    {
      "id": "M8-4",
      "mod": "M8",
      "modName": "字符串与其他",
      "layer": 1,
      "level": 10,
      "t": "Manacher",
      "s": "回文串",
      "pre": [
        "M8-1"
      ],
      "problems": [
        {
          "pid": "P3805",
          "name": "【模板】Manacher",
          "difficulty": 5
        },
        {
          "pid": "P6216",
          "name": "回文匹配",
          "difficulty": 6
        },
        {
          "pid": "P1659",
          "name": "[国家集训队] 拉拉队排练",
          "difficulty": 5
        },
        {
          "pid": "P4552",
          "name": "[Poetize6] IncDec Sequence",
          "difficulty": 4
        }
      ]
    },
    {
      "id": "M8-5",
      "mod": "M8",
      "modName": "字符串与其他",
      "layer": 1,
      "level": 10,
      "t": "Trie 字典树",
      "s": "前缀检索",
      "pre": [
        "M8-1"
      ],
      "problems": [
        {
          "pid": "P8306",
          "name": "【模板】字典树 / Trie",
          "difficulty": 3
        },
        {
          "pid": "P2580",
          "name": "于是他错误的点名开始了",
          "difficulty": 3
        },
        {
          "pid": "P4551",
          "name": "最长异或路径",
          "difficulty": 4
        },
        {
          "pid": "P2922",
          "name": "[USACO08DEC] Secret Message G",
          "difficulty": 4
        }
      ]
    },
    {
      "id": "M8-6",
      "mod": "M8",
      "modName": "字符串与其他",
      "layer": 2,
      "level": 10,
      "t": "AC 自动机",
      "s": "多模式匹配",
      "pre": [
        "M8-5",
        "M8-3"
      ],
      "problems": [
        {
          "pid": "P3808",
          "name": "AC 自动机（简单版）",
          "difficulty": 6
        },
        {
          "pid": "P5357",
          "name": "【模板】AC 自动机",
          "difficulty": 6
        },
        {
          "pid": "P3796",
          "name": "AC 自动机（简单版 II）",
          "difficulty": 6
        },
        {
          "pid": "P3041",
          "name": "[USACO12JAN] Video Game G",
          "difficulty": 6
        }
      ]
    },
    {
      "id": "M8-7",
      "mod": "M8",
      "modName": "字符串与其他",
      "layer": 2,
      "level": 10,
      "t": "后缀数组 / 后缀自动机",
      "s": "后缀结构",
      "pre": [
        "M8-2"
      ],
      "problems": [
        {
          "pid": "P3809",
          "name": "【模板】后缀排序（SA）",
          "difficulty": 6
        },
        {
          "pid": "P3804",
          "name": "【模板】后缀自动机（SAM）",
          "difficulty": 7
        },
        {
          "pid": "P4070",
          "name": "[SDOI2016] 生成魔咒",
          "difficulty": 7
        },
        {
          "pid": "P3975",
          "name": "[TJOI2015] 弦论",
          "difficulty": 7
        }
      ]
    }
  ],
  "totalProblems": 319
};
