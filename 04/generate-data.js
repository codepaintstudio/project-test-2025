/* 数据生成脚本，不需要修改 */
const fs = require('fs');

// 单姓列表
const singleLastNames = [
  '赵', '钱', '孙', '李', '周', '吴', '郑', '王', '冯', '陈',
  '褚', '卫', '蒋', '沈', '韩', '杨', '朱', '秦', '尤', '许',
  '何', '吕', '施', '张', '孔', '曹', '严', '华', '金', '魏',
  '陶', '姜', '戚', '谢', '邹', '喻', '柏', '水', '窦', '章',
  '云', '苏', '潘', '葛', '奚', '范', '彭', '郎', '鲁', '韦',
  '田', '马', '苗', '凤', '花', '方', '俞', '任', '袁', '柳',
  '鲍', '史', '唐', '费', '岑', '薛', '雷', '贺', '倪', '汤',
  '滕', '殷', '罗', '毕', '郝', '邬', '安', '常', '乐', '于',
  '时', '傅', '皮', '卞', '齐', '康', '伍', '余', '元', '卜'
];

// 复姓列表
const doubleLastNames = [
  '欧阳', '太史', '端木', '上官', '司马', '东方', '独孤', '南宫', '万俟', '闻人',
  '夏侯', '诸葛', '尉迟', '公羊', '赫连', '澹台', '皇甫', '宗政', '濮阳', '公冶',
  '太叔', '申屠', '公孙', '慕容', '仲孙', '钟离', '长孙', '宇文', '司徒', '鲜于'
];

// 少数民族姓氏
const ethnicLastNames = [
  '阿', '艾', '敖', '巴', '白', '包', '鲍', '毕', '布', '才',
  '蔡', '苍', '曹', '岑', '陈', '成', '程', '池', '赤', '褚',
  '淳于', '次仁', '崔', '戴', '达', '旦', '党', '刀', '德', '邓'
];

// 名字列表（包含二字和三字名字）
const firstNames = [
  '伟', '芳', '娜', '敏', '静', '丽', '强', '磊', '军', '洋',
  '勇', '艳', '杰', '娟', '涛', '明', '超', '秀英', '霞', '平',
  '刚', '桂英', '丽', '楠', '波', '成', '慧', '萌萌', '丹', '玲',
  '雪', '宁', '婷', '欢', '莹', '文', '玉', '楠', '倩', '霞',
  '阳', '洋', '帆', '建', '旭', '帅', '浩', '凯', '健', '峰',
  '亮', '艳华', '丽娟', '丽华', '丽娜', '丽霞', '丽敏', '丽娟', '丽萍', '丽红',
  '嘉诚', '子涵', '思雨', '欣怡', '梓涵', '晨曦', '诗涵', '俊杰', '志强', '丽琴',
  '嘉怡', '浩然', '若汐', '一诺', '芷晴', '雨桐', '奕辰', '宇轩', '雅琪', '若彤',
  '紫涵', '佳怡', '梦瑶', '欣妍', '佳琪', '佳音', '佳颖', '佳欣', '佳慧', '佳瑶'
];

// 城市列表（扩展更多城市）
const cities = [
  '北京市', '上海市', '广州市', '深圳市', '成都市', '杭州市', '武汉市', '西安市', '南京市', '天津市',
  '重庆市', '青岛市', '苏州市', '长沙市', '郑州市', '大连市', '宁波市', '厦门市', '福州市', '无锡市',
  '合肥市', '昆明市', '哈尔滨市', '济南市', '长春市', '温州市', '石家庄市', '南宁市', '常州市', '舟山市',
  '金华市', '乌鲁木齐市', '拉萨市', '银川市', '西宁市', '呼和浩特市', '海口市', '贵阳市', '兰州市', '太原市',
  '沈阳市', '长春市', '福州市', '南昌市', '长沙市', '郑州市', '石家庄市', '哈尔滨市', '呼和浩特市', '南宁市',
  '海口市', '成都市', '贵阳市', '昆明市', '拉萨市', '西安市', '兰州市', '西宁市', '银川市', '乌鲁木齐市',
  '台北市', '高雄市', '台南市', '台中市', '香港特别行政区', '澳门特别行政区', '大连市', '青岛市', '宁波市', '厦门市',
  '深圳市', '东莞市', '佛山市', '中山市', '珠海市', '南宁市', '柳州市', '桂林市', '北海市', '三亚市'
];

// 区域列表（扩展更多区域）
const districts = [
  '朝阳区', '海淀区', '西城区', '东城区', '丰台区', '石景山区', '浦东新区', '黄浦区', '徐汇区', '长宁区',
  '天河区', '越秀区', '荔湾区', '白云区', '南山区', '福田区', '宝安区', '龙岗区', '武侯区', '锦江区',
  '金牛区', '青羊区', '成华区', '高新区', '经济技术开发区', '工业园区', '市中心区', '新区', '老城区', '商业区',
  '解放区', '建设区', '前进区', '向阳区', '振兴区', '胜利区', '光明区', '建设区', '发展区', '试验区'
];

// 生成随机手机号
function generatePhone() {
  const prefix = ['138', '139', '158', '159', '188', '137', '150', '135', '136', '189', '177', '166', '199'];
  const randomPrefix = prefix[Math.floor(Math.random() * prefix.length)];
  let suffix = '';
  for (let i = 0; i < 8; i++) {
    suffix += Math.floor(Math.random() * 10);
  }
  return randomPrefix + suffix;
}

// 生成随机邮箱
function generateEmail(name) {
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'qq.com', '163.com', '126.com', 'sina.com', 'outlook.com', 'foxmail.com'];
  const randomDomain = domains[Math.floor(Math.random() * domains.length)];
  return `${name.toLowerCase()}${Math.floor(Math.random() * 10000)}@${randomDomain}`;
}

// 生成随机姓名（考虑复姓、少数民族和三字名字）
function generateName() {
  // 决定姓名类型：70%单姓, 20%复姓, 10%少数民族姓氏
  const nameType = Math.random();
  let lastName = '';

  if (nameType < 0.7) {
    // 单姓
    lastName = singleLastNames[Math.floor(Math.random() * singleLastNames.length)];
  } else if (nameType < 0.9) {
    // 复姓
    lastName = doubleLastNames[Math.floor(Math.random() * doubleLastNames.length)];
  } else {
    // 少数民族姓氏
    lastName = ethnicLastNames[Math.floor(Math.random() * ethnicLastNames.length)];
  }

  // 决定名字长度：80%二字名字, 20%三字名字
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];

  return lastName + firstName;
}

// 生成随机地址
function generateAddress() {
  const city = cities[Math.floor(Math.random() * cities.length)];
  const district = districts[Math.floor(Math.random() * districts.length)];
  const streetNumber = Math.floor(Math.random() * 1000) + 1;
  return `${city}${district}${streetNumber}号`;
}

// 生成联系人数据
function generateContacts(count) {
  const contacts = [];
  for (let i = 1; i <= count; i++) {
    const name = generateName();
    contacts.push({
      id: i,
      name: name,
      phone: generatePhone(),
      email: generateEmail(name),
      address: generateAddress()
    });
  }
  return contacts;
}

// 生成联系人
const contacts = generateContacts(1000);

// 写入文件
fs.writeFileSync('data.json', JSON.stringify(contacts, null, 2));
console.log('已生成包含联系人的data.json文件');