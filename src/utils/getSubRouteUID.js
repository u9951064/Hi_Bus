export default function (subRouteUID) {
  if (/^(HSZ|HSQ|MIA|CHA|NAN|YUN|CYQ|CYI|PIF|ILA|HUA|TTT|PEN|THB)[a-z0-9]+(1|2)$/i.test(subRouteUID)) {
    return subRouteUID.replace(/(1|2)$/, '');
  }
  return subRouteUID;
}