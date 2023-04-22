

import {describe, expect, test} from '@jest/globals';
import { getChainWithMultipleInputs } from '../examples/chainToTestInputsFlow';
import { listUserInputsForFlow } from '../promptNode';

describe('gets inputs in chain', () => {
  test('gets inputs in chain', () => {
    // NOTE that we deduplicate by input name.
    // IF this is failing with the answer 4 then that changed but this test didn't
    const chain = getChainWithMultipleInputs();
    const inputs = listUserInputsForFlow(chain, new Set())
    expect(inputs.length).toBe(3);
  })
})