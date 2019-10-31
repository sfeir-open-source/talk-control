import 'module-alias/register';
import { expect } from 'chai';
import itWorks from '@src/index';

describe('smoke test', function() {
    it('checks itWorks method', function() {
        expect(itWorks('app')).to.equal('app works !');
    });
});
